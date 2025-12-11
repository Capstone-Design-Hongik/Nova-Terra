package org.landmark.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentRequest(
        @NotBlank(message = "부동산 ID는 필수입니다.")
        String propertyId,

        @NotBlank(message = "사용자 ID는 필수입니다.")
        String userId,

        @NotNull(message = "투자 금액은 필수입니다.")
        @Positive(message = "투자 금액은 양수여야 합니다.")
        Long amount,

        @NotNull(message = "구매할 토큰 수량은 필수입니다.")
        @Positive(message = "토큰 수량은 양수여야 합니다.")
        Long tokenAmount
) {
}
