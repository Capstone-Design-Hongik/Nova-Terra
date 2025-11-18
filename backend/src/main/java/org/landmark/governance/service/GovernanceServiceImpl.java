package org.landmark.governance.service;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.governance.domain.Proposal;
import org.landmark.governance.domain.ProposalStatus;
import org.landmark.governance.dto.ProposalCreateRequest;
import org.landmark.governance.dto.ProposalResponse;
import org.landmark.governance.repository.ProposalRepository;
import org.landmark.properties.domain.Property;
import org.landmark.properties.repository.PropertyRepository;
import org.landmark.user.domain.User;
import org.landmark.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GovernanceServiceImpl implements GovernanceService {
  private final ProposalRepository proposalRepository;
  private final UserRepository userRepository;
  private final PropertyRepository propertyRepository;

  /* 모든 제안 목록 조회 */
  @Override
  public List<ProposalResponse> findAllProposals() {
    List<Proposal> proposals = proposalRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

    return proposals.stream()
        .map(ProposalResponse::from)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public ProposalResponse createProposal(String userId, ProposalCreateRequest request) {

    if (request.endAt() <= request.startAt()) {
      throw new BusinessException(ErrorCode.INVALID_PROPOSAL_DATE);
    }

    User proposer = userRepository.findById(userId)
        .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    Property property = propertyRepository.findById(request.propertyId())
        .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

    Proposal newProposal = request.toEntity(property, proposer);
    Proposal savedProposal = proposalRepository.save(newProposal);

    return ProposalResponse.from(savedProposal);
  }

  @Override
  @Transactional
  public Long cancelProposal(String userId, Long proposalId) {

    Proposal proposal = proposalRepository.findById(proposalId)
        .orElseThrow(() -> new BusinessException(ErrorCode.PROPOSAL_NOT_FOUND));

    if (!proposal.getProposer().getId().equals(userId)) {
      throw new BusinessException(ErrorCode.FORBIDDEN_EXCEPTION);
    }

    if (proposal.getStatus() != ProposalStatus.PENDING && proposal.getStatus() != ProposalStatus.ACTIVE) {
      throw new BusinessException(ErrorCode.PROPOSAL_CANNOT_CANCEL);
    }

    proposal.cancel();

    return proposal.getId();
  }
}
