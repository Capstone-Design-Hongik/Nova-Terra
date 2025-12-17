package org.landmark.global.toss.dto;

public record TossWebhookRequest(
        String eventType,
        String createdAt,
        TossWebhookData data
) {
    public record TossWebhookData(
            String orderId,
            String paymentKey,
            String status,
            Long totalAmount,
            VirtualAccountInfo virtualAccount
    ) {
    }

    public record VirtualAccountInfo(
            String accountNumber,
            String bankCode
    ) {
    }
}
