package org.landmark.domain.bonding.repository;

import org.landmark.domain.bonding.domain.CreditReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreditReportRepository extends JpaRepository<CreditReport, Long> {
    Optional<CreditReport> findTopByWalletAddressOrderByCreatedAtDesc(String walletAddress);
}
