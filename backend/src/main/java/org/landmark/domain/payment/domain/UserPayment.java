package org.landmark.domain.payment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "UserPayments", indexes = {
        @Index(name = "idx_user_payment_user_id", columnList = "user_id"),
        @Index(name = "idx_user_payment_order_id", columnList = "toss_order_id", unique = true),
        @Index(name = "idx_user_payment_payment_key", columnList = "toss_payment_key", unique = true)
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserPayment {

    @Id
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "wallet_address", nullable = false, length = 42)
    private String walletAddress;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "toss_order_id", nullable = false, length = 100)
    private String tossOrderId;

    @Column(name = "toss_payment_key", length = 200)
    private String tossPaymentKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserPaymentStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Builder
    public UserPayment(String userId, String walletAddress, Long amount, String tossOrderId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.walletAddress = walletAddress;
        this.amount = amount;
        this.tossOrderId = tossOrderId;
        this.status = UserPaymentStatus.PENDING;
    }

    public void markDone(String paymentKey) {
        this.tossPaymentKey = paymentKey;
        this.status = UserPaymentStatus.DONE;
        this.paidAt = LocalDateTime.now();
    }

    public void markFailed() {
        this.status = UserPaymentStatus.FAILED;
    }
}
