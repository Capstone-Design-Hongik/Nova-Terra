package org.landmark.domain.rental.repository;

import org.landmark.domain.rental.domain.PropertyVirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyVirtualAccountRepository extends JpaRepository<PropertyVirtualAccount, String> {
    Optional<PropertyVirtualAccount> findByPropertyId(String propertyId);
    Optional<PropertyVirtualAccount> findByTossOrderId(String tossOrderId);
    Optional<PropertyVirtualAccount> findByVirtualAccountNumber(String virtualAccountNumber);
    boolean existsByPropertyId(String propertyId);
}
