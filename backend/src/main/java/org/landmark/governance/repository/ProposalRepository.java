package org.landmark.governance.repository;

import org.landmark.governance.domain.Proposal;
import org.landmark.governance.domain.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByStatus(ProposalStatus status);

    List<Proposal> findByProperty_Id(String propertyId);

    List<Proposal> findByProposer_Id(String proposerAddress);

    List<Proposal> findByStatusAndStartAtLessThanEqualAndEndAtGreaterThan(
        ProposalStatus status, Long now1, Long now2
    );
}
