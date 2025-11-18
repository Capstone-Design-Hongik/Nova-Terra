package org.landmark.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @Column(name = "wallet_address", length = 42)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_at", updatable = false)
    private Long createdAt;

    // --- 연관관계 ---

    @PrePersist
    protected void onCreate() {
        // 현재 시간을 초 단위 Unix timestamp로 저장
        this.createdAt = System.currentTimeMillis() / 1000L;
    }

    @Builder
    public User(String walletAddress, String email, String passwordHash, String name) {
        this.id = walletAddress;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
    }

}
