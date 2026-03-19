package org.landmark.domain.bonding.dto;

public record VerificationResponse(
        String requestHash,
        String status,
        Integer score,
        String grade
) {
    public static VerificationResponse pendingChain(String requestHash) {
        return new VerificationResponse(requestHash, "pending_chain", null, null);
    }

    public static VerificationResponse pendingReport() {
        return new VerificationResponse(null, "pending_report", null, null);
    }

    public static VerificationResponse creditPendingChain(String requestHash, int score, String grade) {
        return new VerificationResponse(requestHash, "pending_chain", score, grade);
    }
}
