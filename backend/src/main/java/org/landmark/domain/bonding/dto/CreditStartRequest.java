package org.landmark.domain.bonding.dto;

import jakarta.validation.constraints.NotBlank;

public record CreditStartRequest(
        String agentId,
        @NotBlank String givenName,
        @NotBlank String familyName,
        @NotBlank String dateOfBirth,
        @NotBlank String email,
        @NotBlank String phoneNumber,
        @NotBlank String street,
        @NotBlank String city,
        @NotBlank String region,
        @NotBlank String postalCode,
        @NotBlank String country
) {
}
