package org.landmark.domain.rental.repository;

import org.landmark.domain.rental.domain.RentalIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RentalIncomeRepository extends JpaRepository<RentalIncome, String> {
    Optional<RentalIncome> findByTossOrderId(String tossOrderId);
}
