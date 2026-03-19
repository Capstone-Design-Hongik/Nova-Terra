package org.landmark.domain.bonding.repository;

import org.landmark.domain.bonding.domain.KycIdentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KycIdentityRepository extends JpaRepository<KycIdentity, Long> {
    Optional<KycIdentity> findTopByWalletAddressOrderByCreatedAtDesc(String walletAddress);
    Optional<KycIdentity> findBySessionId(String sessionId);
}
