package org.landmark.domain.reconciliation.domain;

public enum ReconciliationType {
    HOLDING_MISMATCH,       // UserHolding(DB) vs 온체인 토큰 잔액 불일치
    DISTRIBUTION_TX_FAILED  // DISTRIBUTED 상태인데 실제 TX가 실패한 경우
}
