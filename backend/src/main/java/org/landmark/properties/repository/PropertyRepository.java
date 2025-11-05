package org.landmark.properties.repository;

import org.landmark.properties.domain.Property;
import org.landmark.properties.domain.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, String> {
    // 특정 상태의 부동산 상품 목록 조회
    List<Property> findByStatus(PropertyStatus status);

    // 여러 상태의 부동산 상품 목록 조회
    List<Property> findByStatusIn(List<PropertyStatus> statuses);

    // STO 토큰 주소로 부동산 상품을 찾음
    Optional<Property> findByDaoTokenAddress(String daoTokenAddress); // dao 토큰 주소로 찾기
}
