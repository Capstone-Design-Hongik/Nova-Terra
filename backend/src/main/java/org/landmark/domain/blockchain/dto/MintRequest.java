package org.landmark.domain.blockchain.dto;

import java.math.BigDecimal;

public record MintRequest(
        String propertyId,
        Long totalSupply,
        BigDecimal valuationPrice
) {
}
