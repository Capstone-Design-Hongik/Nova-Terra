package org.landmark.domain.portfolio.dto;

import java.util.List;

public record PortfolioResponse(
    String userId,
    List<PropertyHoldingResponse> holdings
) {
    public static PortfolioResponse of(String userId, List<PropertyHoldingResponse> holdings) {
        return new PortfolioResponse(userId, holdings);
    }
}
