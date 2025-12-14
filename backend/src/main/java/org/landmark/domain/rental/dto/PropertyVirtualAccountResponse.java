package org.landmark.domain.rental.dto;

import java.time.LocalDateTime;

public record PropertyVirtualAccountResponse(
        String id,
        String propertyId,
        String virtualAccountNumber,
        String bankName,
        LocalDateTime createdAt
) {
}
