package org.landmark.domain.payment.dto;

import org.landmark.domain.payment.domain.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponse(
        String paymentId,
        String propertyId,
        String userId,
        Long amount,
        Long tokenAmount,
        PaymentStatus status,
        String virtualAccountNumber,
        String virtualAccountBankName,
        LocalDateTime virtualAccountExpiredAt,
        LocalDateTime createdAt
) {
}
