package org.landmark.domain.blockchain.dto;

public record MintResponse(
        boolean success,
        String txHash,
        String message
) {
}
