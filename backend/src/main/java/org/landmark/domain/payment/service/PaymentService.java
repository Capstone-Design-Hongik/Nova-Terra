package org.landmark.domain.payment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.investment.domain.Investment;
import org.landmark.domain.investment.repository.InvestmentRepository;
import org.landmark.domain.payment.client.TossPaymentsClientInterface;
import org.landmark.domain.payment.domain.Payment;
import org.landmark.domain.payment.domain.PaymentStatus;
import org.landmark.domain.payment.dto.PaymentRequest;
import org.landmark.domain.payment.dto.PaymentResponse;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountRequest;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountResponse;
import org.landmark.domain.payment.repository.PaymentRepository;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.global.constants.PaymentConstants;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.util.BankCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PropertyRepository propertyRepository;
    private final InvestmentRepository investmentRepository;
    private final TossPaymentsClientInterface tossPaymentsClient;

    /* 가상계좌 발급 요청 */
    @Transactional
    public PaymentResponse requestPayment(PaymentRequest request) {
        log.info("결제 요청 시작 - userId: {}, propertyId: {}, amount: {}",
                request.userId(), request.propertyId(), request.amount());

        // 부동산 정보 조회
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        // 토스페이먼츠 가상계좌 발급 요청
        String orderId = generateOrderId();
        TossVirtualAccountRequest tossRequest = new TossVirtualAccountRequest(
                request.amount(),
                orderId,
                property.getName() + " 토큰 투자",
                request.userId(),
                PaymentConstants.VIRTUAL_ACCOUNT_VALID_HOURS,
                PaymentConstants.DEFAULT_VIRTUAL_ACCOUNT_BANK_CODE
        );

        TossVirtualAccountResponse tossResponse = tossPaymentsClient.issueVirtualAccount(tossRequest);

        // Payment 엔티티 생성 및 저장
        Payment payment = Payment.builder()
                .propertyId(request.propertyId())
                .userId(request.userId())
                .amount(request.amount())
                .tokenAmount(request.tokenAmount())
                .paymentMethod(PaymentConstants.PAYMENT_METHOD_VIRTUAL_ACCOUNT)
                .virtualAccountNumber(tossResponse.virtualAccount().accountNumber())
                .virtualAccountBankCode(tossResponse.virtualAccount().bankCode())
                .virtualAccountBankName(BankCode.getNameByCode(tossResponse.virtualAccount().bankCode()))
                .virtualAccountExpiredAt(parseExpiredAt(tossResponse.virtualAccount().dueDate()))
                .tossOrderId(orderId)
                .build();

        paymentRepository.save(payment);

        log.info("가상계좌 발급 완료 - paymentId: {}, accountNumber: {}",
                payment.getId(), payment.getVirtualAccountNumber());

        return new PaymentResponse(
                payment.getId(),
                payment.getPropertyId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getTokenAmount(),
                payment.getStatus(),
                payment.getVirtualAccountNumber(),
                payment.getVirtualAccountBankName(),
                payment.getVirtualAccountExpiredAt(),
                payment.getCreatedAt()
        );
    }

    /* 결제 정보 조회 */
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        return new PaymentResponse(
                payment.getId(),
                payment.getPropertyId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getTokenAmount(),
                payment.getStatus(),
                payment.getVirtualAccountNumber(),
                payment.getVirtualAccountBankName(),
                payment.getVirtualAccountExpiredAt(),
                payment.getCreatedAt()
        );
    }

    /* 입금 완료 처리 */
    @Transactional
    public void completePayment(String orderId, String paymentKey) {
        log.info("입금 완료 처리 시작 - orderId: {}, paymentKey: {}", orderId, paymentKey);

        // Payment 조회
        Payment payment = paymentRepository.findByTossOrderId(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        // 이미 완료된 결제인지 확인
        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.warn("이미 완료된 결제입니다 - orderId: {}", orderId);
            throw new BusinessException(ErrorCode.PAYMENT_ALREADY_COMPLETED);
        }

        payment.completePayment(paymentKey);

        Investment investment = Investment.builder()
                .userId(payment.getUserId())
                .propertyId(payment.getPropertyId())
                .paymentId(payment.getId())
                .tokenAmount(payment.getTokenAmount())
                .investmentAmount(payment.getAmount())
                .build();

        investmentRepository.save(investment);

        // TODO: 5. 블록체인 서버로 토큰 전송 요청
        // String txHash = blockchainClient.transferToken(...)
        // investment.updateTransferTxHash(txHash);

        log.info("입금 완료 처리 성공 - paymentId: {}, investmentId: {}",
                payment.getId(), investment.getId());
    }

    /* 주문 ID 생성 */
    private String generateOrderId() {
        return "ORDER_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /* ISO 8601 날짜 문자열 → LocalDateTime 변환 */
    private LocalDateTime parseExpiredAt(String dueDateString) {
        try {
            return LocalDateTime.parse(dueDateString, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            log.warn("가상계좌 만료 시간 파싱 실패 - dueDate: {}", dueDateString);
            return LocalDateTime.now().plusHours(24);  // 기본값: 24시간 후
        }
    }
}
