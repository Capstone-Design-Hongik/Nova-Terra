// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./GovernanceToken.sol";

/// @title SimpleGovernance
/// @notice 부동산 조각투자 DAO - 의견 투표 전용 (실행 없음)
contract Governance {
    struct Proposal {
        uint256 id;
        string description;      // "샤시 재설치 진행할까요?"
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        uint256 snapshot;
        bool closed;             // 투표 종료 여부
        ProposalType proposalType;
        mapping(address => bool) hasVoted;
    }

    enum ProposalType {
        GENERAL,    // 일반: 과반수
        CRITICAL,   // 중요: 2/3 (건물 매각 등)
        EMERGENCY   // 긴급: 빠른 결정
    }

    GovernanceToken public governanceToken;
    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;

    // 설정값
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1e18;  // 1토큰
    uint256 public constant EMERGENCY_THRESHOLD = 5e18;     // 긴급은 5토큰
    uint256 public constant VOTING_DELAY = 1;
    uint256 public constant MIN_VOTING_PERIOD = 3 days;
    uint256 public constant EMERGENCY_VOTING_PERIOD = 1 days;
    
    uint256 public normalQuorumPercentage = 10;
    uint256 public emergencyQuorumPercentage = 5;

    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        string description,
        ProposalType proposalType,
        uint256 deadline,
        uint256 snapshot
    );
    
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalClosed(
        uint256 indexed id,
        bool passed,
        uint256 votesFor,
        uint256 votesAgainst
    );

    event DelegateChanged(
        address indexed delegator,
        address indexed fromDelegate,
        address indexed toDelegate
    );

    constructor(address _governanceTokenAddress) {
        governanceToken = GovernanceToken(_governanceTokenAddress);
    }

    /// @notice 제안 생성 (메인)
    function createProposal(
        string memory _description,
        uint256 _duration,
        ProposalType _proposalType
    ) public returns (uint256) {
        // 토큰 요구사항 확인
        uint256 requiredThreshold = _proposalType == ProposalType.EMERGENCY
            ? EMERGENCY_THRESHOLD
            : MIN_PROPOSAL_THRESHOLD;
        
        require(
            governanceToken.getVotes(msg.sender) >= requiredThreshold,
            "Insufficient tokens to propose"
        );

        // 투표 기간 확인
        if (_proposalType == ProposalType.EMERGENCY) {
            require(
                _duration >= EMERGENCY_VOTING_PERIOD && _duration <= 2 days,
                "Emergency: 1-2 days only"
            );
        } else {
            require(_duration >= MIN_VOTING_PERIOD, "Voting period too short");
        }

        uint256 snapshot = block.number + VOTING_DELAY;
        uint256 proposalId = nextProposalId;

        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.description = _description;
        newProposal.deadline = block.timestamp + _duration;
        newProposal.snapshot = snapshot;
        newProposal.proposalType = _proposalType;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            _description,
            _proposalType,
            newProposal.deadline,
            snapshot
        );

        nextProposalId++;
        return proposalId;
    }

    /// @notice 일반 제안 (간편)
    function createGeneralProposal(
        string memory _description,
        uint256 _duration
    ) external returns (uint256) {
        return createProposal(_description, _duration, ProposalType.GENERAL);
    }

    /// @notice 긴급 제안 (간편)
    function createEmergencyProposal(
        string memory _description
    ) external returns (uint256) {
        return createProposal(_description, EMERGENCY_VOTING_PERIOD, ProposalType.EMERGENCY);
    }

    /// @notice 중요 제안 (간편)
    function createCriticalProposal(
        string memory _description,
        uint256 _duration
    ) external returns (uint256) {
        return createProposal(_description, _duration, ProposalType.CRITICAL);
    }

    /// @notice 투표
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.number > proposal.snapshot, "Voting not started");
        require(block.timestamp <= proposal.deadline, "Voting ended");
        require(!proposal.closed, "Proposal closed");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 weight = governanceToken.getPastVotes(msg.sender, proposal.snapshot);
        require(weight > 0, "No voting power");

        if (_support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }

        proposal.hasVoted[msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _support, weight);
    }

    /// @notice 투표 종료 (결과만 확정)
    function closeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp > proposal.deadline, "Voting not ended");
        require(!proposal.closed, "Already closed");

        // 정족수 확인
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = governanceToken.getPastTotalSupply(proposal.snapshot);
        
        uint256 requiredQuorum = proposal.proposalType == ProposalType.EMERGENCY
            ? emergencyQuorumPercentage
            : normalQuorumPercentage;
        
        uint256 quorum = (totalSupply * requiredQuorum) / 100;
        require(totalVotes >= quorum, "Quorum not reached");

        // 통과 여부 확인
        bool passed;
        if (proposal.proposalType == ProposalType.CRITICAL) {
            passed = proposal.votesFor >= (totalVotes * 2) / 3;
        } else {
            passed = proposal.votesFor > proposal.votesAgainst;
        }

        proposal.closed = true;

        emit ProposalClosed(
            _proposalId,
            passed,
            proposal.votesFor,
            proposal.votesAgainst
        );
        
        // 실행 로직 없음! 단순히 결과만 기록
        // 통과하면 사람이 직접 실행
    }

    /// @notice 투표권 위임
    function delegateVotingPower(address delegatee) external {
        address previousDelegate = governanceToken.delegates(msg.sender);
        governanceToken.delegate(delegatee);
        emit DelegateChanged(msg.sender, previousDelegate, delegatee);
    }

    /// @notice 위임 취소
    function removeDelegation() external {
        address previousDelegate = governanceToken.delegates(msg.sender);
        governanceToken.delegate(msg.sender);
        emit DelegateChanged(msg.sender, previousDelegate, msg.sender);
    }

    /// @notice 현재 위임 대상
    function getCurrentDelegate(address account) external view returns (address) {
        return governanceToken.delegates(account);
    }

    /// @notice 현재 투표권
    function getCurrentVotingPower(address account) external view returns (uint256) {
        return governanceToken.getVotes(account);
    }

    /// @notice 과거 투표권
    function getPastVotingPower(address account, uint256 blockNumber) 
        external 
        view 
        returns (uint256) 
    {
        return governanceToken.getPastVotes(account, blockNumber);
    }

    /// @notice 제안 상태
    function getProposalState(uint256 _proposalId) 
        external 
        view 
        returns (string memory) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        if (proposal.id != _proposalId) {
            return "Does not exist";
        }
        
        if (proposal.closed) {
            return "Closed";
        }
        
        if (block.timestamp <= proposal.deadline) {
            if (block.number <= proposal.snapshot) {
                return "Pending";
            }
            return "Active";
        }
        
        return "Ended (not closed)";
    }

    /// @notice 제안 정보
    function getProposal(uint256 _proposalId)
        external
        view
        returns (
            uint256 id,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            uint256 snapshot,
            bool closed,
            ProposalType proposalType
        )
    {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.deadline,
            proposal.snapshot,
            proposal.closed,
            proposal.proposalType
        );
    }

    /// @notice 투표 여부
    function hasVoted(uint256 _proposalId, address _voter) 
        external 
        view 
        returns (bool) 
    {
        return proposals[_proposalId].hasVoted[_voter];
    }

    /// @notice 통과 여부 미리보기
    function willProposalPass(uint256 _proposalId) 
        external 
        view 
        returns (bool willPass, string memory reason) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = governanceToken.getPastTotalSupply(proposal.snapshot);
        
        uint256 requiredQuorum = proposal.proposalType == ProposalType.EMERGENCY
            ? emergencyQuorumPercentage
            : normalQuorumPercentage;
        
        uint256 quorum = (totalSupply * requiredQuorum) / 100;
        
        if (totalVotes < quorum) {
            return (false, "Quorum not reached");
        }
        
        if (proposal.proposalType == ProposalType.CRITICAL) {
            if (proposal.votesFor >= (totalVotes * 2) / 3) {
                return (true, "Will pass (2/3 majority)");
            } else {
                return (false, "Need 2/3 majority");
            }
        } else {
            if (proposal.votesFor > proposal.votesAgainst) {
                return (true, "Will pass (majority)");
            } else {
                return (false, "Insufficient votes");
            }
        }
    }

    /// @notice 정족수 설정
    function setNormalQuorum(uint256 _percentage) external {
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");
        normalQuorumPercentage = _percentage;
    }

    function setEmergencyQuorum(uint256 _percentage) external {
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");
        emergencyQuorumPercentage = _percentage;
    }
}