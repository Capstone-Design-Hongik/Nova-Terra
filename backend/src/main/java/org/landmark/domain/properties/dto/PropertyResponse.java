package org.landmark.domain.properties.dto;

import org.landmark.domain.properties.domain.BuildingType;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.domain.PropertyStatus;

import java.math.BigDecimal;

public record PropertyResponse(
        String id,
        String name,
        String description,
        String address,
        String coverImageUrl,
        BuildingType buildingType,
        BigDecimal exclusiveAreaSqm,
        Integer totalFloors,
        String floor,
        Long useApprovalDate,
        Integer parkingSpaces,
        String direction,
        Integer roomCount,
        Integer bathroomCount,
        Long managementFee,
        BigDecimal occupancyRate,
        String majorTenants,
        Long totalMonthlyRent,
        BigDecimal totalValuation,
        Long totalTokens,
        BigDecimal pricePerToken,
        BigDecimal expenseRate,
        BigDecimal feeRate,
        PropertyStatus status
) {
    public static PropertyResponse from(Property property) {
        // STO 토큰 1개당 가격 = 부동산 총 가치 / 총 토큰 수량
        BigDecimal pricePerToken = property.getTotalValuation()
            .divide(new BigDecimal(property.getTotalTokens()), 2, java.math.RoundingMode.HALF_UP);

        return new PropertyResponse(
                property.getId(),
                property.getName(),
                property.getDescription(),
                property.getAddress(),
                property.getCoverImageUrl(),
                property.getBuildingType(),
                property.getExclusiveAreaSqm(),
                property.getTotalFloors(),
                property.getFloor(),
                property.getUseApprovalDate(),
                property.getParkingSpaces(),
                property.getDirection(),
                property.getRoomCount(),
                property.getBathroomCount(),
                property.getManagementFee(),
                property.getOccupancyRate(),
                property.getMajorTenants(),
                property.getTotalMonthlyRent(),
                property.getTotalValuation(),
                property.getTotalTokens(),
                pricePerToken,
                property.getExpenseRate(),
                property.getFeeRate(),
                property.getStatus()
        );
    }
}
