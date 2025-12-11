package org.landmark.domain.payment.client;

import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountRequest;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@ConditionalOnProperty(name = "payment.mock.enabled", havingValue = "true", matchIfMissing = false)
public class MockTossPaymentsClient implements TossPaymentsClientInterface {

    @Value("${payment.mock.account-number}")
    private String mockAccountNumber;

    @Value("${payment.mock.bank-code}")
    private String mockBankCode;

    @Value("${payment.mock.bank-name}")
    private String mockBankName;

    @Override
    public TossVirtualAccountResponse issueVirtualAccount(TossVirtualAccountRequest request) {
        log.info("🎭 [MOCK] 가상계좌 발급 - orderId: {}, amount: {}",
                request.orderId(), request.amount());
        log.warn("⚠️ Mock 모드 활성화: 실제 토스페이먼츠 API 호출하지 않음");

        // 가상계좌 만료 시간 (24시간 후)
        LocalDateTime expiredAt = LocalDateTime.now().plusHours(24);
        String dueDate = expiredAt.format(DateTimeFormatter.ISO_DATE_TIME);

        // Mock 응답 생성
        TossVirtualAccountResponse.TossVirtualAccount virtualAccount =
                new TossVirtualAccountResponse.TossVirtualAccount(
                        "FIXED",
                        mockAccountNumber,
                        mockBankCode,
                        request.customerName(),
                        dueDate,
                        "NONE",
                        false,
                        "INCOMPLETE"
                );

        TossVirtualAccountResponse response = new TossVirtualAccountResponse(
                "tvivarepublica",
                "1.3",
                "MOCK_PAYMENT_KEY_" + request.orderId(),
                request.orderId(),
                request.orderName(),
                "KRW",
                "가상계좌",
                request.amount(),
                request.amount(),
                String.valueOf(request.amount()),
                0L,
                "WAITING_FOR_DEPOSIT",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                null,
                virtualAccount
        );

        log.info("🎭 [MOCK] 가상계좌 발급 완료 - 계좌번호: {} ({})",
                mockAccountNumber, mockBankName);

        return response;
    }
}
