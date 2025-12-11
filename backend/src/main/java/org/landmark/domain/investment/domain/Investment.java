package org.landmark.domain.investment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Investments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "property_id", nullable = false, length = 42)
    private String propertyId;

    @Column(name = "payment_id", nullable = false)
    private String paymentId;

    @Column(name = "token_amount", nullable = false)
    private Long tokenAmount;

    @Column(name = "investment_amount", nullable = false)
    private Long investmentAmount;

    @Column(name = "transfer_tx_hash", length = 66)
    private String transferTxHash;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Investment(String userId, String propertyId, String paymentId,
                      Long tokenAmount, Long investmentAmount) {
        this.userId = userId;
        this.propertyId = propertyId;
        this.paymentId = paymentId;
        this.tokenAmount = tokenAmount;
        this.investmentAmount = investmentAmount;
    }

    /* 토큰 전송 완료 후 트랜잭션 해시 저장 */
    public void updateTransferTxHash(String txHash) {
        this.transferTxHash = txHash;
    }
}
