package org.landmark.domain.governance.domain;

public enum ProposalStatus {
    PENDING,  // 유예 기간 (취소 가능)
    ACTIVE,   // 투표 진행 중
    PASSED,   // 통과
    FAILED,   // 부결
    CANCELLED // 제안자/관리자에 의해 취소됨
}
