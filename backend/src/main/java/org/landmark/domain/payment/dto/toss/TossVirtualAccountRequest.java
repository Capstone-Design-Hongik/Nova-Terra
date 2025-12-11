package org.landmark.domain.payment.dto.toss;

public record TossVirtualAccountRequest(
        Long amount,
        String orderId,
        String orderName,
        String customerName,
        String validHours,
        String bank
) {
}
