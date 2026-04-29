package org.landmark.global.blockchain.outbox.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "BlockchainOutbox", indexes = {
        @Index(name = "idx_outbox_status_created", columnList = "status, created_at"),
        @Index(name = "idx_outbox_aggregate", columnList = "aggregate_type, aggregate_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BlockchainOutbox {

    @Id
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "aggregate_type", nullable = false, length = 50)
    private String aggregateType;

    @Column(name = "aggregate_id", nullable = false, length = 100)
    private String aggregateId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tx_type", nullable = false, length = 50)
    private OutboxTxType txType;

    @Column(name = "contract_address", nullable = false, length = 42)
    private String contractAddress;

    @Column(name = "to_address", length = 42)
    private String toAddress;

    @Column(name = "amount", length = 80)
    private String amount;

    @Lob
    @Column(name = "payload")
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OutboxStatus status;

    @Column(name = "nonce")
    private Long nonce;

    @Column(name = "tx_hash", length = 80)
    private String txHash;

    @Column(name = "retry_count", nullable = false)
    private int retryCount;

    @Column(name = "last_error", length = 1000)
    private String lastError;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @Builder
    public BlockchainOutbox(String aggregateType, String aggregateId, OutboxTxType txType,
                            String contractAddress, String toAddress, String amount, String payload) {
        this.id = UUID.randomUUID().toString();
        this.aggregateType = aggregateType;
        this.aggregateId = aggregateId;
        this.txType = txType;
        this.contractAddress = contractAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.payload = payload;
        this.status = OutboxStatus.READY;
        this.retryCount = 0;
    }

    public void markSubmitted(Long nonce, String txHash) {
        this.status = OutboxStatus.SUBMITTED;
        this.nonce = nonce;
        this.txHash = txHash;
        this.submittedAt = LocalDateTime.now();
    }

    public void markConfirmed() {
        this.status = OutboxStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void markFinalized() {
        this.status = OutboxStatus.FINALIZED;
        this.finalizedAt = LocalDateTime.now();
    }

    public void markFailed(String error) {
        this.status = OutboxStatus.FAILED;
        this.lastError = error != null && error.length() > 1000 ? error.substring(0, 1000) : error;
        this.retryCount++;
    }

    public void markDead(String error) {
        this.status = OutboxStatus.DEAD;
        this.lastError = error != null && error.length() > 1000 ? error.substring(0, 1000) : error;
    }

    public void resetToReady() {
        this.status = OutboxStatus.READY;
    }

    public boolean isRetryable(int maxRetry) {
        return this.retryCount < maxRetry;
    }
}
