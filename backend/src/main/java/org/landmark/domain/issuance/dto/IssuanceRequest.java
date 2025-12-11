package org.landmark.domain.issuance.dto;

import jakarta.validation.constraints.NotBlank;

public record IssuanceRequest(
        @NotBlank(message = "부동산 ID는 필수입니다.")
        String propertyId
) {
}
