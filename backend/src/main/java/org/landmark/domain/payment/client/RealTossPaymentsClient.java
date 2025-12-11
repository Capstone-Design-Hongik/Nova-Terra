package org.landmark.domain.payment.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountRequest;
import org.landmark.domain.payment.dto.toss.TossVirtualAccountResponse;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "payment.mock.enabled", havingValue = "false", matchIfMissing = false)
public class RealTossPaymentsClient implements TossPaymentsClientInterface {

    private final RestClient tossPaymentsRestClient;

    @Override
    public TossVirtualAccountResponse issueVirtualAccount(TossVirtualAccountRequest request) {
        log.info("토스페이먼츠 가상계좌 발급 요청 - orderId: {}, amount: {}",
                request.orderId(), request.amount());

        try {
            TossVirtualAccountResponse response = tossPaymentsRestClient.post()
                    .uri("/v1/virtual-accounts")
                    .body(request)
                    .retrieve()
                    .body(TossVirtualAccountResponse.class);

            if (response == null) {
                log.error("토스페이먼츠로부터 응답이 없습니다.");
                throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
            }

            log.info("가상계좌 발급 성공 - orderId: {}, accountNumber: {}",
                    response.orderId(), response.virtualAccount().accountNumber());
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("토스페이먼츠 API 통신 중 예외 발생", e);
            throw new BusinessException(ErrorCode.PAYMENT_API_ERROR);
        }
    }
}
