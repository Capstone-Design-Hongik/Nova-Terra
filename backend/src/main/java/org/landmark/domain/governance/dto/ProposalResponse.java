package org.landmark.domain.governance.dto;

import java.util.List;
import org.landmark.domain.governance.domain.Proposal;
import org.landmark.domain.governance.domain.ProposalStatus;

public record ProposalResponse(
    String id,
    String title,
    String description,

    String propertyId,
    String propertyName,

    String proposerName,
    Long startAt,
    Long endTime,
    List<String> choices,
    ProposalStatus status
) {
  public static ProposalResponse from(Proposal proposal) {
    String proposerName = (proposal.getProposer() != null) ?
        proposal.getProposer().getName() : "System";

    return new ProposalResponse(
        String.valueOf(proposal.getId()),
        proposal.getTitle(),
        proposal.getDescription(),
        proposal.getProperty().getId(),
        proposal.getProperty().getName(),
        proposerName,
        proposal.getStartAt(),
        proposal.getEndAt(),
        proposal.getChoices(),
        proposal.getStatus()
    );
  }
}
