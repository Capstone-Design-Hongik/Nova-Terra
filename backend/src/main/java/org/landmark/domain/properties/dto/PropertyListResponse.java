package org.landmark.domain.properties.dto;

import org.landmark.domain.properties.domain.BuildingType;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.domain.PropertyStatus;

import java.math.BigDecimal;

public record PropertyListResponse(
        String id,
        String name,
        String address,
        String coverImageUrl,
        BuildingType buildingType,
        BigDecimal occupancyRate,
        Long totalMonthlyRent,
        BigDecimal totalValuation,
        BigDecimal pricePerToken,
        BigDecimal latitude,
        BigDecimal longitude,
        PropertyStatus status
) {
    public static PropertyListResponse from(Property property) {
        return new PropertyListResponse(
                property.getId(),
                property.getName(),
                property.getAddress(),
                property.getCoverImageUrl(),
                property.getBuildingType(),
                property.getOccupancyRate(),
                property.getTotalMonthlyRent(),
                property.getTotalValuation(),
                property.getPricePerToken(),
                property.getLatitude(),
                property.getLongitude(),
                property.getStatus()
        );
    }
}
