package org.landmark.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.landmark.domain.auth.domain.RefreshToken;
import org.landmark.domain.auth.repository.RefreshTokenRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.security.jwt.JwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void store(User user, String refreshToken) {
        long now = nowEpochSeconds();
        refreshTokenRepository.revokeAllActiveByUserId(user.getId(), now);

        String tokenHash = hashToken(refreshToken);
        long expiresAt = jwtTokenProvider.getExpirationEpochSeconds(refreshToken);
        refreshTokenRepository.save(RefreshToken.issue(user, tokenHash, expiresAt));
    }

    @Transactional
    public void rotate(User user, String oldRefreshToken, String newRefreshToken) {
        String oldHash = hashToken(oldRefreshToken);
        RefreshToken existing = refreshTokenRepository
                .findByUser_IdAndTokenHashAndRevokedAtIsNull(user.getId(), oldHash)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN));

        long now = nowEpochSeconds();
        if (existing.getExpiresAt() <= now) {
            existing.revoke(now);
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        existing.revoke(now);

        String newHash = hashToken(newRefreshToken);
        long newExpiresAt = jwtTokenProvider.getExpirationEpochSeconds(newRefreshToken);
        refreshTokenRepository.save(RefreshToken.issue(user, newHash, newExpiresAt));
    }

    @Transactional(readOnly = true)
    public void validateUsable(User user, String refreshToken) {
        String tokenHash = hashToken(refreshToken);
        RefreshToken existing = refreshTokenRepository
                .findByUser_IdAndTokenHashAndRevokedAtIsNull(user.getId(), tokenHash)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN));

        long now = nowEpochSeconds();
        if (existing.getExpiresAt() <= now) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }

    private static long nowEpochSeconds() {
        return Instant.now().getEpochSecond();
    }

    private static String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
