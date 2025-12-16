package org.landmark.domain.portfolio.repository;

import org.landmark.domain.portfolio.domain.UserHolding;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHoldingRepository extends JpaRepository<UserHolding, Long> {

    /* 사용자의 모든 보유 자산 조회 (Property 정보 함께 fetch) */
    @EntityGraph(attributePaths = {"property"})
    List<UserHolding> findAllByUserIdOrderByCreatedAtDesc(String userId);

    /* 사용자가 특정 부동산을 보유하고 있는지 확인 */
    boolean existsByUserIdAndPropertyId(String userId, String propertyId);
}
