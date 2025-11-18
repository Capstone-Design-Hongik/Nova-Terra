package org.landmark.governance.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import java.math.BigInteger;
import java.util.List;
import org.landmark.governance.domain.Proposal;
import org.landmark.properties.domain.Property;
import org.landmark.user.domain.User;


public record ProposalCreateRequest(
    @NotNull(message = "부동산 ID는 필수입니다.")
    String propertyId, // STO 토큰 주소 (Property PK)

    @NotEmpty(message = "제안 제목은 필수입니다.")
    @Size(max = 255, message = "제목은 255자를 초과할 수 없습니다.")
    String title,

    @NotEmpty(message = "제안 내용은 필수입니다.")
    String description,

    @NotNull(message = "투표 시작 시간은 필수입니다.")
    Long startAt, // Unix time

    @NotNull(message = "투표 마감 시간은 필수입니다.")
    Long endAt, // Unix time

    @NotEmpty(message = "선택지는 1개 이상이어야 합니다.")
    List<String> choices
) {
    public Proposal toEntity(Property property, User proposer, BigInteger onChainProposalId) {
      return Proposal.builder()
          .property(property)
          .proposer(proposer)
          .title(title)
          .description(description)
          .startAt(startAt)
          .endAt(endAt)
          .choices(choices)
          .onChainProposalId(onChainProposalId)
          .build();
    }
}
