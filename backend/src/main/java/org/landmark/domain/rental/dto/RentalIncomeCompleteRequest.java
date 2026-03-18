package org.landmark.domain.rental.dto;

public record RentalIncomeCompleteRequest(
        String accountNumberOrOrderId,
        Long amount,
        String paymentKey  // nullable — 없으면 자동 생성
) {
}
