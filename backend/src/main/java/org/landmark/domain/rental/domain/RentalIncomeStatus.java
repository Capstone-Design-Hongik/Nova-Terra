package org.landmark.domain.rental.domain;

public enum RentalIncomeStatus {
    PENDING,      // 입금 완료, 분배 대기 중
    DISTRIBUTED,  // KRWT 분배 완료
    FAILED        // 분배 실패
}
