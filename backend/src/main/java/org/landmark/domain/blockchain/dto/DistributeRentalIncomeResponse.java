package org.landmark.domain.blockchain.dto;

public record DistributeRentalIncomeResponse(
        boolean success,
        String txHash,
        String message
) {
}
