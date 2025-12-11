package org.landmark.domain.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.webhook.TossWebhookRequest;
import org.landmark.domain.payment.service.PaymentService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments/webhook")
@RequiredArgsConstructor
@Tag(name = "Payment Webhook", description = "토스페이먼츠 Webhook API")
public class PaymentWebhookController {

    private final PaymentService paymentService;

    @Operation(summary = "토스페이먼츠 Webhook", description = "토스페이먼츠로부터 입금 완료 알림을 받습니다.")
    @PostMapping("/toss")
    public ApiResponse<Void> handleTossWebhook(@RequestBody TossWebhookRequest request) {
        log.info("토스페이먼츠 Webhook 수신 - eventType: {}, orderId: {}",
                request.eventType(), request.data().orderId());

        // 입금 완료 이벤트만 처리
        if ("Payment.Confirm".equals(request.eventType()) && "DONE".equals(request.data().status())) {
            paymentService.completePayment(
                    request.data().orderId(),
                    request.data().paymentKey()
            );
            log.info("입금 완료 처리 성공 - orderId: {}", request.data().orderId());
        } else {
            log.info("처리하지 않는 이벤트 - eventType: {}, status: {}",
                    request.eventType(), request.data().status());
        }

        return ApiResponse.ok(200, "Webhook 처리 완료");
    }
}
