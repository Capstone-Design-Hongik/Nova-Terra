package org.landmark.domain.rental.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.blockchain.client.BlockchainClient;
import org.landmark.domain.blockchain.dto.DistributeRentalIncomeRequest;
import org.landmark.domain.blockchain.dto.DistributeRentalIncomeResponse;
import org.landmark.global.toss.client.TossPaymentsClient;
import org.landmark.global.toss.dto.TossVirtualAccountRequest;
import org.landmark.global.toss.dto.TossVirtualAccountResponse;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.rental.domain.PropertyVirtualAccount;
import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.dto.PropertyVirtualAccountResponse;
import org.landmark.domain.rental.dto.RentalIncomeResponse;
import org.landmark.domain.rental.repository.PropertyVirtualAccountRepository;
import org.landmark.domain.rental.repository.RentalIncomeRepository;
import org.landmark.global.constants.PaymentConstants;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.util.BankCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RentalIncomeService {

    private final RentalIncomeRepository rentalIncomeRepository;
    private final PropertyVirtualAccountRepository propertyVirtualAccountRepository;
    private final PropertyRepository propertyRepository;
    private final TossPaymentsClient tossPaymentsClient;
    private final BlockchainClient blockchainClient;

    /* Property별 임대 수익 전용 가상계좌 발급 */
    @Transactional
    public PropertyVirtualAccountResponse issueVirtualAccountForProperty(String propertyId) {
        log.info("Property별 임대 수익 가상계좌 발급 시작 - propertyId: {}", propertyId);

        // 이미 발급된 가상계좌가 있는지 확인
        if (propertyVirtualAccountRepository.existsByPropertyId(propertyId)) {
            log.warn("이미 발급된 가상계좌가 있습니다 - propertyId: {}", propertyId);
            throw new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_ALREADY_EXISTS);
        }

        // Property 존재 여부 확인
        var property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        // 토스페이먼츠 가상계좌 발급 요청
        String orderId = generateRentalOrderId(propertyId);
        TossVirtualAccountRequest tossRequest = new TossVirtualAccountRequest(
                PaymentConstants.RENTAL_VIRTUAL_ACCOUNT_TEMP_AMOUNT,
                orderId,
                property.getName() + " 임대 수익",
                PaymentConstants.DEFAULT_TENANT_NAME,
                PaymentConstants.RENTAL_VIRTUAL_ACCOUNT_VALID_HOURS,
                PaymentConstants.DEFAULT_VIRTUAL_ACCOUNT_BANK_CODE
        );

        TossVirtualAccountResponse tossResponse = tossPaymentsClient.issueVirtualAccount(tossRequest);

        // PropertyVirtualAccount 엔티티 생성 및 저장
        PropertyVirtualAccount virtualAccount = PropertyVirtualAccount.builder()
                .propertyId(propertyId)
                .virtualAccountNumber(tossResponse.virtualAccount().accountNumber())
                .bankCode(tossResponse.virtualAccount().bankCode())
                .bankName(BankCode.getNameByCode(tossResponse.virtualAccount().bankCode()))
                .tossOrderId(orderId)
                .build();

        propertyVirtualAccountRepository.save(virtualAccount);

        log.info("가상계좌 발급 완료 - propertyId: {}, accountNumber: {}",
                propertyId, virtualAccount.getVirtualAccountNumber());

        return new PropertyVirtualAccountResponse(
                virtualAccount.getId(),
                virtualAccount.getPropertyId(),
                virtualAccount.getVirtualAccountNumber(),
                virtualAccount.getBankName(),
                virtualAccount.getCreatedAt()
        );
    }

    /* 임대 수익 입금 완료 처리 (Webhook에서 호출) */
    @Transactional
    public void completeRentalIncome(String accountNumberOrOrderId, String paymentKey, Long amount) {
        log.info("임대 수익 입금 완료 처리 시작 - accountNumberOrOrderId: {}, amount: {}", accountNumberOrOrderId, amount);

        // PropertyVirtualAccount 조회 (가상계좌 번호 또는 tossOrderId로)
        PropertyVirtualAccount virtualAccount = propertyVirtualAccountRepository
                .findByVirtualAccountNumber(accountNumberOrOrderId)
                .or(() -> propertyVirtualAccountRepository.findByTossOrderId(accountNumberOrOrderId))
                .orElseThrow(() -> {
                    log.error("가상계좌를 찾을 수 없습니다 - accountNumberOrOrderId: {}", accountNumberOrOrderId);
                    return new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND);
                });

        log.info("가상계좌 조회 성공 - propertyId: {}, accountNumber: {}",
                virtualAccount.getPropertyId(), virtualAccount.getVirtualAccountNumber());

        // RentalIncome 생성
        RentalIncome rentalIncome = RentalIncome.builder()
                .propertyId(virtualAccount.getPropertyId())
                .amount(amount)
                .tenantName(null)
                .tossOrderId(virtualAccount.getTossOrderId())
                .build();

        rentalIncome.completeDeposit(paymentKey);
        rentalIncomeRepository.save(rentalIncome);

        // 블록체인 서버로 KRWT 분배 요청
        try {
            DistributeRentalIncomeRequest distributeRequest = new DistributeRentalIncomeRequest(
                    virtualAccount.getPropertyId(),
                    rentalIncome.getKrwtAmount()
            );

            DistributeRentalIncomeResponse distributeResponse = blockchainClient.distributeRentalIncome(distributeRequest);
            rentalIncome.completeDistribution(distributeResponse.txHash());

            log.info("임대 수익 분배 완료 - rentalIncomeId: {}, txHash: {}",
                    rentalIncome.getId(), distributeResponse.txHash());

        } catch (Exception e) {
            log.error("임대 수익 분배 실패 - rentalIncomeId: {}", rentalIncome.getId(), e);
            rentalIncome.failDistribution();
            throw e;
        }
    }

    /* Property별 임대 수익 내역 조회 */
    @Transactional(readOnly = true)
    public List<RentalIncomeResponse> getRentalIncomesByProperty(String propertyId) {
        // TODO: Property별 조회 쿼리 메서드 추가 필요
        return rentalIncomeRepository.findAll().stream()
                .filter(rentalIncome -> rentalIncome.getPropertyId().equals(propertyId))
                .map(this::toResponse)
                .toList();
    }

    /* Property별 가상계좌 조회 */
    @Transactional(readOnly = true)
    public PropertyVirtualAccountResponse getVirtualAccountByProperty(String propertyId) {
        PropertyVirtualAccount virtualAccount = propertyVirtualAccountRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND));

        return new PropertyVirtualAccountResponse(
                virtualAccount.getId(),
                virtualAccount.getPropertyId(),
                virtualAccount.getVirtualAccountNumber(),
                virtualAccount.getBankName(),
                virtualAccount.getCreatedAt()
        );
    }

    /* RentalIncome -> RentalIncomeResponse 변환 */
    private RentalIncomeResponse toResponse(RentalIncome rentalIncome) {
        return new RentalIncomeResponse(
                rentalIncome.getId(),
                rentalIncome.getPropertyId(),
                rentalIncome.getAmount(),
                rentalIncome.getKrwtAmount(),
                rentalIncome.getTenantName(),
                rentalIncome.getStatus(),
                rentalIncome.getDistributionTxHash(),
                rentalIncome.getDepositDate(),
                rentalIncome.getDistributedAt()
        );
    }

    /* 임대 수익용 주문 ID 생성 */
    private String generateRentalOrderId(String propertyId) {
        return "RENTAL_" + propertyId + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
