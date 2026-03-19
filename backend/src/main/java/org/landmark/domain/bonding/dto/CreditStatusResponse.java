package org.landmark.domain.bonding.dto;

import org.landmark.domain.bonding.domain.CreditReport;

public record CreditStatusResponse(
        String walletAddress,
        String status,
        Integer score,
        String grade,
        String reportHash,
        Long updatedAt
) {
    public static CreditStatusResponse from(CreditReport report) {
        return new CreditStatusResponse(
                report.getWalletAddress(),
                report.getStatus().name(),
                report.getScore(),
                report.getGrade(),
                report.getReportHash(),
                report.getUpdatedAt()
        );
    }
}
