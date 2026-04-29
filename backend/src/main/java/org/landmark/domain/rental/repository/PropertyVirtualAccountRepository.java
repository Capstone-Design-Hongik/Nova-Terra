package org.landmark.domain.rental.repository;

import org.landmark.domain.rental.domain.PropertyVirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyVirtualAccountRepository extends JpaRepository<PropertyVirtualAccount, String> {
    List<PropertyVirtualAccount> findAllByPropertyIdOrderByCreatedAtDesc(String propertyId);
    Optional<PropertyVirtualAccount> findByTossOrderId(String tossOrderId);
    Optional<PropertyVirtualAccount> findByVirtualAccountNumber(String virtualAccountNumber);
}
