package org.landmark.governance.service;

import java.util.List;
import org.landmark.governance.dto.ProposalCreateRequest;
import org.landmark.governance.dto.ProposalResponse;

public interface GovernanceService {
  List<ProposalResponse> findAllProposals();
  ProposalResponse createProposal(String userId, ProposalCreateRequest request);
  Long cancelProposal(String userId, Long proposalId);
}
