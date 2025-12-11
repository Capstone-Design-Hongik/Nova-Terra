package org.landmark.domain.payment.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "property_id", nullable = false, length = 42)
    private String propertyId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "token_amount", nullable = false)
    private Long tokenAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; // 가상 계좌

    @Column(name = "virtual_account_number")
    private String virtualAccountNumber;

    @Column(name = "virtual_account_bank_code")
    private String virtualAccountBankCode;

    @Column(name = "virtual_account_bank_name")
    private String virtualAccountBankName;

    @Column(name = "virtual_account_expired_at")
    private LocalDateTime virtualAccountExpiredAt;

    @Column(name = "toss_order_id", unique = true)
    private String tossOrderId;

    @Column(name = "toss_payment_key")
    private String tossPaymentKey;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Builder
    public Payment(String propertyId, String userId, Long amount, Long tokenAmount,
                   String paymentMethod, String virtualAccountNumber,
                   String virtualAccountBankCode, String virtualAccountBankName,
                   LocalDateTime virtualAccountExpiredAt, String tossOrderId) {
        this.propertyId = propertyId;
        this.userId = userId;
        this.amount = amount;
        this.tokenAmount = tokenAmount;
        this.status = PaymentStatus.PENDING;
        this.paymentMethod = paymentMethod;
        this.virtualAccountNumber = virtualAccountNumber;
        this.virtualAccountBankCode = virtualAccountBankCode;
        this.virtualAccountBankName = virtualAccountBankName;
        this.virtualAccountExpiredAt = virtualAccountExpiredAt;
        this.tossOrderId = tossOrderId;
    }

    /* 결제 완료 처리 */
    public void completePayment(String paymentKey) {
        this.status = PaymentStatus.COMPLETED;
        this.tossPaymentKey = paymentKey;
        this.completedAt = LocalDateTime.now();
    }

    /* 결제 실패 처리 */
    public void failPayment() {
        this.status = PaymentStatus.FAILED;
    }

    /* 가상계좌 만료 처리 */
    public void expirePayment() {
        this.status = PaymentStatus.EXPIRED;
    }
}
