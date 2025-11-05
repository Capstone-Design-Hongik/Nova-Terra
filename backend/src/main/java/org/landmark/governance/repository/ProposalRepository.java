package org.landmark.governance.repository;

import org.landmark.governance.domain.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, String> {

    List<Proposal> findByProperty_Id(String propertyId);

    List<Proposal> findByProposer_Id(String proposerAddress);
}
