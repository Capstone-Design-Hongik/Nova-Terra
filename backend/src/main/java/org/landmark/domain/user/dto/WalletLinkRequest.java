package org.landmark.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record WalletLinkRequest(
    @NotBlank(message = "지갑 주소는 필수입니다.")
    @Pattern(regexp = "^0x[0-9a-fA-F]{40}$", message = "올바른 지갑 주소 형식이 아닙니다.")
    String walletAddress
) {}
