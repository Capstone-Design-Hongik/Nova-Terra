package org.landmark.domain.payment.dto.toss;

public record TossVirtualAccountResponse(
        String mId,
        String version,
        String paymentKey,
        String orderId,
        String orderName,
        String currency,
        String method,
        Long totalAmount,
        Long balanceAmount,
        String suppliedAmount,
        Long vat,
        String status,
        String requestedAt,
        String approvedAt,
        TossVirtualAccount virtualAccount
) {
    public record TossVirtualAccount(
            String accountType,
            String accountNumber,
            String bankCode,
            String customerName,
            String dueDate,
            String refundStatus,
            boolean expired,
            String settlementStatus
    ) {
    }
}
