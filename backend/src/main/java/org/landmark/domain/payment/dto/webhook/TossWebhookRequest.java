package org.landmark.domain.payment.dto.webhook;

public record TossWebhookRequest(
        String eventType,
        String createdAt,
        TossWebhookData data
) {
    public record TossWebhookData(
            String orderId,
            String paymentKey,
            String status,
            Long totalAmount
    ) {
    }
}
