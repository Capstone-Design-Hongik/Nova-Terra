package org.landmark.properties.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import org.landmark.properties.domain.Property;

public record PropertyCreateRequest(
    @NotNull String stoTokenAddress,
    @NotNull String daoTokenAddress,
    @NotNull String daoContractAddress,
    @NotNull String name,
    String description,
    String address,
    String buildingType,
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
    @NotNull BigDecimal totalValuation,
    @NotNull Long totalTokens,
    BigDecimal expenseRate,
    BigDecimal feeRate
) {
    public Property toEntity(String coverImageUrl) {
      return Property.builder()
          .stoTokenAddress(stoTokenAddress)
          .daoTokenAddress(daoTokenAddress)
          .daoContractAddress(daoContractAddress)
          .name(name)
          .description(description)
          .address(address)
          .coverImageUrl(coverImageUrl)
          .buildingType(buildingType)
          .exclusiveAreaSqm(exclusiveAreaSqm)
          .totalFloors(totalFloors)
          .floor(floor)
          .useApprovalDate(useApprovalDate)
          .parkingSpaces(parkingSpaces)
          .direction(direction)
          .roomCount(roomCount)
          .bathroomCount(bathroomCount)
          .managementFee(managementFee)
          .occupancyRate(occupancyRate)
          .majorTenants(majorTenants)
          .totalMonthlyRent(totalMonthlyRent)
          .totalValuation(totalValuation)
          .totalTokens(totalTokens)
          .expenseRate(expenseRate)
          .feeRate(feeRate)
          .build();
    }
}
