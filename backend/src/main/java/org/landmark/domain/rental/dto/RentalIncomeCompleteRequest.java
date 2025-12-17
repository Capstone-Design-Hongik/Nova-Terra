package org.landmark.domain.rental.dto;

public record RentalIncomeCompleteRequest(
        String accountNumberOrOrderId,
        Long amount
) {
}
