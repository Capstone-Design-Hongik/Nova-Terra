package org.landmark.domain.issuance.dto;

import java.math.BigDecimal;

public record IssuanceResponse(
        String propertyId,
        String txHash,
        BigDecimal valuationPrice,
        Long totalSupply
) {
}
