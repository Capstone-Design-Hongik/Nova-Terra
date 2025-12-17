package org.landmark.global.toss.dto;

public record TossVirtualAccountRequest(
        Long amount,
        String orderId,
        String orderName,
        String customerName,
        String validHours,
        String bank
) {
}
