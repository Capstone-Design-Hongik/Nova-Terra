package org.landmark.domain.bonding.dto;

import jakarta.validation.constraints.NotBlank;

public record KycValidateRequest(
        String agentId,
        @NotBlank String sessionId
) {
}
