package org.landmark.domain.portfolio.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.user.domain.User;

@Entity
@Table(name = "user_holdings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "property_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = System.currentTimeMillis() / 1000L;
    }

    @Builder
    public UserHolding(User user, Property property) {
        this.user = user;
        this.property = property;
    }
}
