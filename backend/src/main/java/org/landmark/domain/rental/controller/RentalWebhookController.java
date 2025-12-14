package org.landmark.domain.rental.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.toss.dto.TossWebhookRequest;
import org.landmark.domain.rental.service.RentalIncomeService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/rental/webhook")
@RequiredArgsConstructor
@Tag(name = "Rental Webhook", description = "임대 수익 Webhook API")
public class RentalWebhookController {

    private final RentalIncomeService rentalIncomeService;

    @Operation(summary = "토스페이먼츠 임대 수익 Webhook", description = "토스페이먼츠로부터 임대 수익 입금 완료 알림을 받습니다.")
    @PostMapping("/toss")
    public ApiResponse<Void> handleTossRentalWebhook(@RequestBody TossWebhookRequest request) {
        log.info("토스페이먼츠 임대 수익 Webhook 수신 - eventType: {}, orderId: {}",
                request.eventType(), request.data().orderId());

        // 입금 완료 이벤트만 처리
        if ("Payment.Confirm".equals(request.eventType()) && "DONE".equals(request.data().status())) {
            String accountNumberOrOrderId = request.data().orderId();

            try {
                rentalIncomeService.completeRentalIncome(
                        accountNumberOrOrderId,
                        request.data().paymentKey(),
                        request.data().totalAmount()
                );
                log.info("임대 수익 입금 완료 처리 성공 - orderId: {}, amount: {}",
                        accountNumberOrOrderId, request.data().totalAmount());
            } catch (Exception e) {
                log.error("임대 수익 입금 처리 실패 - orderId: {}", accountNumberOrOrderId, e);
            }
        } else {
            log.info("처리하지 않는 이벤트 - eventType: {}, status: {}",
                    request.eventType(), request.data().status());
        }

        return ApiResponse.ok(200, "Webhook 처리 완료");
    }
}
