package org.landmark.domain.blockchain.dto;

public record TransferTokenResponse(
        boolean success,
        String txHash,
        String message
) {
}