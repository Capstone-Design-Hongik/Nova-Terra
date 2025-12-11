package org.landmark.domain.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.dto.PaymentRequest;
import org.landmark.domain.payment.dto.PaymentResponse;
import org.landmark.domain.payment.service.PaymentService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "결제 관리 API")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "가상계좌 발급", description = "토큰 구매를 위한 가상계좌를 발급합니다.")
    @PostMapping
    public ApiResponse<PaymentResponse> requestPayment(@Valid @RequestBody PaymentRequest request) {
        log.info("가상계좌 발급 요청 - userId: {}, propertyId: {}, amount: {}",
                request.userId(), request.propertyId(), request.amount());

        PaymentResponse response = paymentService.requestPayment(request);

        return ApiResponse.created("가상계좌가 발급되었습니다.", response);
    }

    @Operation(summary = "결제 정보 조회", description = "결제 ID로 결제 정보를 조회합니다.")
    @GetMapping("/{paymentId}")
    public ApiResponse<PaymentResponse> getPayment(@PathVariable String paymentId) {
        log.info("결제 정보 조회 - paymentId: {}", paymentId);

        PaymentResponse response = paymentService.getPayment(paymentId);

        return ApiResponse.ok(response);
    }
}
