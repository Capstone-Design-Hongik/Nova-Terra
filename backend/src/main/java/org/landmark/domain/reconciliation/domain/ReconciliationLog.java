package org.landmark.domain.reconciliation.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@Table(name = "ReconciliationLogs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReconciliationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReconciliationType type;

    @Column(name = "property_id", nullable = false)
    private String propertyId;

    @Column(name = "off_chain_value", nullable = false)
    private Long offChainValue;

    @Column(name = "on_chain_value", nullable = false)
    private String onChainValue;  // BigInteger를 String으로 저장

    @Column(name = "difference", nullable = false)
    private String difference;

    @Column(name = "reference_id")
    private String referenceId;  // 관련 txHash 또는 rentalIncomeId

    @Column(name = "resolved", nullable = false)
    private boolean resolved = false;

    @CreationTimestamp
    @Column(name = "detected_at", nullable = false, updatable = false)
    private LocalDateTime detectedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Builder
    public ReconciliationLog(ReconciliationType type, String propertyId,
                             Long offChainValue, BigInteger onChainValue,
                             String referenceId) {
        this.type = type;
        this.propertyId = propertyId;
        this.offChainValue = offChainValue;
        this.onChainValue = onChainValue.toString();
        this.difference = onChainValue.subtract(BigInteger.valueOf(offChainValue)).toString();
        this.referenceId = referenceId;
    }

    public void resolve() {
        this.resolved = true;
        this.resolvedAt = LocalDateTime.now();
    }
}
