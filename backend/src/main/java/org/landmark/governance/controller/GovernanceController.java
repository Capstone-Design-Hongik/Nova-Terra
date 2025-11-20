package org.landmark.governance.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.landmark.global.dto.ApiResponse;
import org.landmark.governance.domain.Proposal;
import org.landmark.governance.dto.ProposalCreateRequest;
import org.landmark.governance.dto.ProposalResponse;
import org.landmark.governance.service.GovernanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/governance")
@RequiredArgsConstructor
public class GovernanceController {
  private final GovernanceService governanceService;

  @GetMapping("/proposals")
  public ResponseEntity<ApiResponse<List<ProposalResponse>>> getAllActiveProposals(
      @RequestParam(required = false) String propertyId
  ) {
    List<ProposalResponse> proposals = governanceService.findAllProposals(propertyId);

    return ResponseEntity.ok(ApiResponse.ok(proposals));
  }

  @PostMapping("/proposals")
  public ResponseEntity<ApiResponse<ProposalResponse>> createProposal(
      @RequestParam String userId, // 임시로 파라미터로 받음
      @Valid @RequestBody ProposalCreateRequest request
  ) {
    ProposalResponse newProposal = governanceService.createProposal(userId, request);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created(newProposal));
  }

  @DeleteMapping("/proposals/{proposalId}")
  public ResponseEntity<ApiResponse<Object>> cancelProposal(
      @RequestParam String userId, // 임시로 파라미터로 받음
      @PathVariable Long proposalId
  ) {
    Long canceledId = governanceService.cancelProposal(userId, proposalId);

    Map<String, Long> responseData = Map.of("proposalId", canceledId);

    return ResponseEntity.ok(ApiResponse.ok(
        HttpStatus.OK.value(), "제안이 성공적으로 취소되었습니다.", responseData
    ));
  }
}
