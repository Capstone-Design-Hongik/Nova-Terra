package org.landmark.domain.governance.service;

import java.util.List;
import org.landmark.domain.governance.dto.ProposalCreateRequest;
import org.landmark.domain.governance.dto.ProposalResponse;

public interface GovernanceService {
  List<ProposalResponse> findAllProposals(String propertyId);
  ProposalResponse createProposal(String userId, ProposalCreateRequest request);
  Long cancelProposal(String userId, Long proposalId);
}
