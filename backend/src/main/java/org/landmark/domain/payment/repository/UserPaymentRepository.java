package org.landmark.domain.payment.repository;

import org.landmark.domain.payment.domain.UserPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPaymentRepository extends JpaRepository<UserPayment, String> {

    Optional<UserPayment> findByTossOrderId(String tossOrderId);

    Optional<UserPayment> findByTossPaymentKey(String tossPaymentKey);

    List<UserPayment> findByUserIdOrderByCreatedAtDesc(String userId);
}
