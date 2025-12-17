package org.landmark.domain.portfolio.dto;

import org.landmark.domain.portfolio.domain.UserHolding;
import org.landmark.domain.properties.dto.PropertyResponse;

public record PropertyHoldingResponse(
    PropertyResponse property,
    Long amount  // 보유 토큰 수량
) {
    public static PropertyHoldingResponse from(UserHolding holding) {
        return new PropertyHoldingResponse(
            PropertyResponse.from(holding.getProperty()),
            holding.getAmount()
        );
    }
}
