package org.landmark.domain.rental.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    // TODO: BlockchainWalletService로 교체 필요 (블록체인 팀 스펙 확정 후)
    // private final BlockchainWalletService blockchainWalletService;

    /* Property별 임대 수익 전용 가상계좌 발급 */
    @Transactional
    public PropertyVirtualAccountResponse issueVirtualAccountForProperty(String propertyId) {
        log.info("Property별 임대 수익 가상계좌 발급 시작 - propertyId: {}", propertyId);

        // Property 존재 여부 확인
        var property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        // 이미 발급된 가상계좌가 있는지 확인 (existsBy 대신 findBy 사용)
        propertyVirtualAccountRepository.findByPropertyId(propertyId)
                .ifPresent(existing -> {
                    log.warn("이미 발급된 가상계좌가 있습니다 - propertyId: {}, accountNumber: {}",
                            propertyId, existing.getVirtualAccountNumber());
                    throw new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_ALREADY_EXISTS);
                });

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

        // TODO: 블록체인 팀과 배당 분배 스펙 확정 후 구현
        // 현재는 SecurityToken 컨트랙트의 배당 분배 방식이 네이티브 코인 기반이므로
        // KRWT 기반으로 변경되면 아래 로직으로 구현 예정:
        // try {
        //     String txHash = blockchainWalletService.sendKrwtToStoContract(
        //         Long.parseLong(virtualAccount.getPropertyId()),
        //         rentalIncome.getKrwtAmount()
        //     );
        //     rentalIncome.completeDistribution(txHash);
        //     log.info("임대 수익 분배 완료 - rentalIncomeId: {}, txHash: {}", rentalIncome.getId(), txHash);
        // } catch (Exception e) {
        //     log.error("임대 수익 분배 실패 - rentalIncomeId: {}", rentalIncome.getId(), e);
        //     rentalIncome.failDistribution();
        //     throw e;
        // }

        // 임시: 블록체인 연동 전까지는 분배 완료 처리
        rentalIncome.completeDistribution("PENDING_BLOCKCHAIN_INTEGRATION");
        log.warn("블록체인 연동 대기 중 - rentalIncomeId: {}, krwtAmount: {}",
                rentalIncome.getId(), rentalIncome.getKrwtAmount());
    }

    /* Property별 임대 수익 내역 조회 */
    @Transactional(readOnly = true)
    public List<RentalIncomeResponse> getRentalIncomesByProperty(String propertyId) {
        return rentalIncomeRepository.findByPropertyIdOrderByDepositDateDesc(propertyId).stream()
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
