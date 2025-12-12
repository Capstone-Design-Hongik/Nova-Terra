package org.landmark.domain.rental.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PropertyVirtualAccounts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PropertyVirtualAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "property_id", nullable = false, unique = true)
    private String propertyId;

    @Column(name = "virtual_account_number", nullable = false, unique = true)
    private String virtualAccountNumber;

    @Column(name = "bank_code", nullable = false)
    private String bankCode;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "toss_order_id", nullable = false, unique = true)
    private String tossOrderId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public PropertyVirtualAccount(String propertyId, String virtualAccountNumber,
                                   String bankCode, String bankName, String tossOrderId) {
        this.propertyId = propertyId;
        this.virtualAccountNumber = virtualAccountNumber;
        this.bankCode = bankCode;
        this.bankName = bankName;
        this.tossOrderId = tossOrderId;
    }
}
