package org.landmark.domain.payment.repository;

import org.landmark.domain.payment.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Optional<Payment> findByTossOrderId(String tossOrderId);

    List<Payment> findByUserId(String userId);

    List<Payment> findByPropertyId(String propertyId);
}
