package org.landmark.domain.governance.domain;

import jakarta.persistence.*;
import java.math.BigInteger;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.user.domain.User;

import java.util.List;

@Entity
@Table(name = "Proposals")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "on_chain_proposal_id", nullable = false, unique = true)
    private BigInteger onChainProposalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false) // Property의 PK (sto_token_address)를 참조
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposer_address")  // User의 PK (wallet_address)를 참조
    private User proposer;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "start_at", nullable = false, updatable = false)
    private Long startAt;

    @Column(name = "end_at", nullable = false)
    private Long endAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> choices;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status;

    @Builder
    public Proposal(BigInteger onChainProposalId, Property property, User proposer, String title,
                    String description, Long startAt, Long endAt, List<String> choices) {

        this.onChainProposalId = onChainProposalId;
        this.property = property;
        this.proposer = proposer;
        this.title = title;
        this.description = description;
        this.startAt = startAt;
        this.endAt = endAt;
        this.choices = choices;

        this.createdAt = System.currentTimeMillis() / 1000L;

        if (startAt > this.createdAt) {
            this.status = ProposalStatus.PENDING;
        } else {
            this.status = ProposalStatus.ACTIVE;
        }
    }

    // --- 비즈니스 메소드 ---
    public void activate() {
        if (this.status == ProposalStatus.PENDING) {
            this.status = ProposalStatus.ACTIVE;
        }
    }

    public void cancel() {
        if (this.status == ProposalStatus.PENDING || this.status == ProposalStatus.ACTIVE) {
            this.status = ProposalStatus.CANCELLED;
        }
    }
}
