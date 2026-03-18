package org.landmark.domain.rental.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.toss.dto.TossWebhookRequest;
import org.landmark.domain.rental.service.RentalIncomeService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/rental/webhook")
@RequiredArgsConstructor
@Tag(name = "Rental Webhook", description = "임대 수익 Webhook API")
public class RentalWebhookController {

    private final RentalIncomeService rentalIncomeService;

    @Operation(summary = "토스페이먼츠 임대 수익 Webhook",
            description = "토스페이먼츠로부터 임대 수익 입금 완료 알림을 받습니다. 실패 시 500을 반환하여 토스가 재시도합니다.")
    @PostMapping("/toss")
    public ResponseEntity<ApiResponse<Void>> handleTossRentalWebhook(@RequestBody TossWebhookRequest request) {
        log.info("토스페이먼츠 임대 수익 Webhook 수신 - eventType: {}, orderId: {}",
                request.eventType(), request.data().orderId());

        if (!"Payment.Confirm".equals(request.eventType()) || !"DONE".equals(request.data().status())) {
            log.info("처리하지 않는 이벤트 - eventType: {}, status: {}",
                    request.eventType(), request.data().status());
            return ResponseEntity.ok(ApiResponse.ok(200, "Webhook 수신 완료 (처리 대상 아님)"));
        }

        // 예외를 삼키지 않음 → 실패 시 500 반환 → 토스가 자동 재시도
        // 멱등성이 보장되므로 재시도해도 안전
        rentalIncomeService.completeRentalIncome(
                request.data().orderId(),
                request.data().paymentKey(),
                request.data().totalAmount()
        );

        log.info("임대 수익 입금 완료 처리 성공 - orderId: {}, amount: {}",
                request.data().orderId(), request.data().totalAmount());

        return ResponseEntity.ok(ApiResponse.ok(200, "Webhook 처리 완료"));
    }

    @Operation(summary = "[테스트용] 임대 수익 입금 완료 처리",
            description = "개발/테스트 환경에서 임대 수익 입금 완료를 직접 시뮬레이션합니다.")
    @PostMapping("/complete")
    public ApiResponse<Void> completeRentalIncome(@RequestBody org.landmark.domain.rental.dto.RentalIncomeCompleteRequest request) {
        log.info("임대 수익 입금 완료 시뮬레이션 - accountNumberOrOrderId: {}, amount: {}",
                request.accountNumberOrOrderId(), request.amount());

        String paymentKey = (request.paymentKey() != null && !request.paymentKey().isBlank())
                ? request.paymentKey()
                : "test_payment_key_" + System.currentTimeMillis();

        rentalIncomeService.completeRentalIncome(
                request.accountNumberOrOrderId(),
                paymentKey,
                request.amount()
        );

        return ApiResponse.ok(200, "임대 수익 입금 완료 처리 성공");
    }
}
