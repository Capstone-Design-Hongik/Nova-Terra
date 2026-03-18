package org.landmark.domain.reconciliation.repository;

import org.landmark.domain.reconciliation.domain.ReconciliationLog;
import org.landmark.domain.reconciliation.domain.ReconciliationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReconciliationLogRepository extends JpaRepository<ReconciliationLog, String> {
    List<ReconciliationLog> findByResolvedFalseOrderByDetectedAtDesc();
    List<ReconciliationLog> findByPropertyIdAndResolvedFalse(String propertyId);
    List<ReconciliationLog> findByTypeAndResolvedFalse(ReconciliationType type);
}
