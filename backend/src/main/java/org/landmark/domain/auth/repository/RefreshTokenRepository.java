package org.landmark.domain.auth.repository;

import org.landmark.domain.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByUser_IdAndTokenHashAndRevokedAtIsNull(String userId, String tokenHash);

    @Modifying
    @Query("update RefreshToken rt set rt.revokedAt = :revokedAt where rt.user.id = :userId and rt.revokedAt is null")
    int revokeAllActiveByUserId(@Param("userId") String userId, @Param("revokedAt") long revokedAt);
}
