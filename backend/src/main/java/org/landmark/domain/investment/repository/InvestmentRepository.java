package org.landmark.domain.investment.repository;

import org.landmark.domain.investment.domain.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, String> {

    List<Investment> findByUserId(String userId);

    List<Investment> findByPropertyId(String propertyId);

    Optional<Investment> findByPaymentId(String paymentId);
}
