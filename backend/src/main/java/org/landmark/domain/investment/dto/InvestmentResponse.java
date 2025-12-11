package org.landmark.domain.investment.dto;

import java.time.LocalDateTime;

public record InvestmentResponse(
        String investmentId,
        String userId,
        String propertyId,
        Long tokenAmount,
        Long investmentAmount,
        String transferTxHash,
        LocalDateTime createdAt
) {
}
