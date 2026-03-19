package org.landmark.domain.bonding.dto;

import jakarta.validation.constraints.NotBlank;

public record CreditValidateRequest(
        @NotBlank String walletAddress
) {
}
