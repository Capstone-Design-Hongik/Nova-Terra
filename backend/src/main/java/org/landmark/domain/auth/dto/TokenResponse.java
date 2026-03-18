package org.landmark.domain.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {
}
