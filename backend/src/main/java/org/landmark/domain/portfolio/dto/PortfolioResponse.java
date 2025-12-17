package org.landmark.domain.portfolio.dto;

import org.landmark.domain.properties.dto.PropertyResponse;

import java.util.List;

public record PortfolioResponse(
    String userId,
    List<PropertyResponse> properties
) {
    public static PortfolioResponse of(String userId, List<PropertyResponse> properties) {
        return new PortfolioResponse(userId, properties);
    }
}
