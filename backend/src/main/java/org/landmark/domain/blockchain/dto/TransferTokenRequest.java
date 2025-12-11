package org.landmark.domain.blockchain.dto;

import java.math.BigDecimal;

public record TransferTokenRequest(
        String propertyId,
        String toAddress,
        Long tokenAmount
) {
}