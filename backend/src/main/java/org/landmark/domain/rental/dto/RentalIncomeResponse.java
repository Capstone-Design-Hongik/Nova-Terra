package org.landmark.domain.rental.dto;

import org.landmark.domain.rental.domain.RentalIncomeStatus;

import java.time.LocalDateTime;

public record RentalIncomeResponse(
        String id,
        String propertyId,
        Long amount,
        Long krwtAmount,
        String tenantName,
        RentalIncomeStatus status,
        String distributionTxHash,
        LocalDateTime depositDate,
        LocalDateTime distributedAt
) {
}
