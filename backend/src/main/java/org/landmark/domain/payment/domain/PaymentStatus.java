package org.landmark.domain.payment.domain;

public enum PaymentStatus {
    PENDING,      // 입금 대기 중
    COMPLETED,    // 입금 완료
    FAILED,       // 결제 실패
    EXPIRED       // 가상계좌 만료
}
