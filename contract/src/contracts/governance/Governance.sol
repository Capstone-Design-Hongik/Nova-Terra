// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Minimal Governance Contract
/// @notice 테스트용 최소 기능만 구현 (제안 생성, 투표, 위임 후 투표 불가)
contract Governance {
    ERC20Votes public governanceToken;
    
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        uint256 snapshot;  // 제안 생성 시점의 블록/타임스탬프
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 3 days;
    
    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 votes);
    
    constructor(address _governanceToken) {
        governanceToken = ERC20Votes(_governanceToken);
    }
    
    /// @notice 제안 생성
    function createProposal(string calldata _description) external returns (uint256) {
        require(governanceToken.getVotes(msg.sender) > 0, "No voting power");
        
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        newProposal.description = _description;
        newProposal.snapshot = governanceToken.clock();  // 현재 시점 스냅샷!
        newProposal.deadline = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(proposalId, _description);
        return proposalId;
    }
    
    /// @notice 투표하기
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // 제안 생성 시점(snapshot!!!!)의 투표권 확인
        uint256 votes = governanceToken.getPastVotes(msg.sender, proposal.snapshot); //getVotes 가 아님!!!!
        require(votes > 0, "No voting power at snapshot");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit Voted(_proposalId, msg.sender, _support, votes);
    }
    
    /// @notice 제안 정보 조회
    function getProposal(uint256 _proposalId) external view returns (
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 deadline,
        uint256 snapshot,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.deadline,
            proposal.snapshot,
            proposal.executed
        );
    }
    
    /// @notice 투표 여부 확인
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }
}
