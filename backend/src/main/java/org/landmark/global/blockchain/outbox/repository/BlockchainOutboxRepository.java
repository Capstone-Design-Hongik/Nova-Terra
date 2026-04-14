package org.landmark.global.blockchain.outbox.repository;

import jakarta.persistence.LockModeType;
import org.landmark.global.blockchain.outbox.domain.BlockchainOutbox;
import org.landmark.global.blockchain.outbox.domain.OutboxStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.QueryHint;
import java.util.List;

public interface BlockchainOutboxRepository extends JpaRepository<BlockchainOutbox, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "jakarta.persistence.lock.timeout", value = "-2")})
    @Query("SELECT o FROM BlockchainOutbox o WHERE o.status = :status ORDER BY o.createdAt ASC")
    List<BlockchainOutbox> findReadyForProcessing(@Param("status") OutboxStatus status, Pageable pageable);

    List<BlockchainOutbox> findByStatusOrderByCreatedAtAsc(OutboxStatus status);

    List<BlockchainOutbox> findByStatusInOrderByCreatedAtAsc(List<OutboxStatus> statuses);
}
