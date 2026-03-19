package org.landmark.domain.bonding.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "credit_reports",
        indexes = {
                @Index(name = "idx_credit_wallet", columnList = "wallet_address"),
                @Index(name = "idx_credit_plaid_user", columnList = "plaid_user_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CreditReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "wallet_address", nullable = false, length = 64)
    private String walletAddress;

    @Column(name = "agent_id", length = 100)
    private String agentId;

    @Column(name = "plaid_user_id", nullable = false, length = 128)
    private String plaidUserId;

    @Column(name = "report_id", length = 128)
    private String reportId;

    @Column(name = "score")
    private Integer score;

    @Column(name = "grade", length = 5)
    private String grade;

    @Column(name = "report_hash", length = 64)
    private String reportHash;

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

    private CreditReport(String walletAddress, String agentId, String plaidUserId, VerificationStatus status) {
        this.walletAddress = walletAddress;
        this.agentId = agentId;
        this.plaidUserId = plaidUserId;
        this.status = status;
    }

    public static CreditReport started(String walletAddress, String agentId, String plaidUserId) {
        return new CreditReport(walletAddress, agentId, plaidUserId, VerificationStatus.STARTED);
    }

    public void markPendingReport() {
        this.status = VerificationStatus.PENDING_REPORT;
    }

    public void markPendingChain(String reportId, int score, String grade, String reportHash, String txHash) {
        this.reportId = reportId;
        this.score = score;
        this.grade = grade;
        this.reportHash = reportHash;
        this.txHash = txHash;
        this.status = VerificationStatus.PENDING_CHAIN;
    }
}
