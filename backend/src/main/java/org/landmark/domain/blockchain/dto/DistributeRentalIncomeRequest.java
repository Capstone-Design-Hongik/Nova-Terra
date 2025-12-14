package org.landmark.domain.blockchain.dto;

public record DistributeRentalIncomeRequest(
        String propertyId,
        Long krwtAmount
) {
}
