package org.landmark.domain.bonding.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kyc_identities",
        indexes = {
                @Index(name = "idx_kyc_wallet", columnList = "wallet_address"),
                @Index(name = "idx_kyc_session", columnList = "session_id", unique = true)
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KycIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "wallet_address", nullable = false, length = 64)
    private String walletAddress;

    @Column(name = "agent_id", length = 100)
    private String agentId;

    @Column(name = "session_id", nullable = false, length = 128, unique = true)
    private String sessionId;

    @Column(name = "id_hash", nullable = false, length = 64)
    private String idHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VerificationStatus status;

    @Column(name = "tx_hash", length = 100)
    private String txHash;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "updated_at", nullable = false)
    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        long now = System.currentTimeMillis() / 1000L;
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = System.currentTimeMillis() / 1000L;
    }

    private KycIdentity(String walletAddress, String agentId, String sessionId, String idHash, VerificationStatus status) {
        this.walletAddress = walletAddress;
        this.agentId = agentId;
        this.sessionId = sessionId;
        this.idHash = idHash;
        this.status = status;
    }

    public static KycIdentity pending(String walletAddress, String agentId, String sessionId, String idHash) {
        return new KycIdentity(walletAddress, agentId, sessionId, idHash, VerificationStatus.PENDING_CHAIN);
    }

    public void setTxHash(String txHash) {
        this.txHash = txHash;
    }
}
