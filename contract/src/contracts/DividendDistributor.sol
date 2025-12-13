// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PropertyToken.sol";

/**
 * @title DividendDistributor
 * @dev 임대수익 분배 컨트랙트
 * 
 * 역할: 토큰 보유 비율에 따른 수익 분배
 * 방식: 스냅샷 기반 클레임
 * 결제: KRWT (원화 스테이블코인)
 */
contract DividendDistributor {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    PropertyToken public token;
    IERC20 public paymentToken;  // KRWT
    
    // 스냅샷 정보
    struct Snapshot {
        uint256 id; 
        uint256 timestamp; //block.timestamp
        uint256 totalSupply; //그 시점 토큰 총 발행량
        uint256 dividendAmount;     // 이번 분배 총액 (KRWT)
        uint256 dividendPerToken;   // 토큰당 배당금
        bool finalized; //배당금 입금 됐는지.
    }
    
    // 스냅샷 ID => 스냅샷 정보
    mapping(uint256 => Snapshot) public snapshots;
    
    // 스냅샷 ID => 주소 => 잔액 (1번 스냅샷 때 A가 가진 토큰 수)
    mapping(uint256 => mapping(address => uint256)) public snapshotBalances;
    
    // 스냅샷 ID => 주소 => 클레임 여부 (A가 1번 스냅샷 배당 받았는지)
    mapping(uint256 => mapping(address => bool)) public claimed;
    
    // 현재 스냅샷 ID 
    uint256 public currentSnapshotId;
    
    // 스냅샷 ID 목록
    uint256[] public snapshotIds;
    
    // 총 분배된 배당금
    uint256 public totalDistributed;
    
    // 미청구 배당금
    uint256 public unclaimedDividends;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event SnapshotCreated(uint256 indexed snapshotId, uint256 totalSupply);
    event DividendDeposited(uint256 indexed snapshotId, uint256 amount);
    event DividendClaimed(uint256 indexed snapshotId, address indexed holder, uint256 amount);
    event UnclaimedWithdrawn(uint256 indexed snapshotId, uint256 amount);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "DividendDistributor: not owner");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor(address _token, address _paymentToken) {
        require(_token != address(0), "DividendDistributor: zero token");
        require(_paymentToken != address(0), "DividendDistributor: zero payment token");
        
        owner = msg.sender;
        token = PropertyToken(_token);
        paymentToken = IERC20(_paymentToken);
    }
    
    // ============================================
    //          SNAPSHOT MANAGEMENT
    // ============================================
    
    /**
     * @dev 스냅샷 생성 (홀더 잔액 확정)
     * 배당 분배 전에 반드시 호출
     */
    function createSnapshot() external onlyOwner returns (uint256 snapshotId) {
        currentSnapshotId++;
        snapshotId = currentSnapshotId;
        
        uint256 totalSupply = token.totalSupply();
        require(totalSupply > 0, "DividendDistributor: no tokens");
        
        snapshots[snapshotId] = Snapshot({
            id: snapshotId, //setting
            timestamp: block.timestamp, //setting
            totalSupply: totalSupply, //setting
            dividendAmount: 0, 
            dividendPerToken: 0,
            finalized: false
        });
        
        snapshotIds.push(snapshotId);
        
        emit SnapshotCreated(snapshotId, totalSupply);
    }
    
    /**
     * @dev 특정 주소의 스냅샷 잔액 기록
     * 가스 최적화를 위해 배치로 처리
     */
    function recordBalances(uint256 snapshotId, address[] calldata holders) 
        external onlyOwner 
    {
        require(snapshots[snapshotId].id != 0, "DividendDistributor: invalid snapshot");
        require(!snapshots[snapshotId].finalized, "DividendDistributor: finalized");
        
        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            if (snapshotBalances[snapshotId][holder] == 0) { 
                snapshotBalances[snapshotId][holder] = token.balanceOf(holder);
            }
        }
    }
    
    // ============================================
    //          DIVIDEND DISTRIBUTION
    // ============================================
    
    /**
     * @dev 배당금 입금 (임대수익 분배)
     *      사전에 paymentToken.approve(이 컨트랙트, amount) 필요!
     * @param snapshotId 배당 대상 스냅샷
     * @param amount 배당금 총액 (KRWT)
     */
    function depositDividend(uint256 snapshotId, uint256 amount) external onlyOwner {
        require(amount > 0, "DividendDistributor: zero amount");
        
        Snapshot storage snapshot = snapshots[snapshotId];
        require(snapshot.id != 0, "DividendDistributor: invalid snapshot");
        require(!snapshot.finalized, "DividendDistributor: already finalized");
        
        // KRWT 받기
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "DividendDistributor: transfer failed"
        );
        
        snapshot.dividendAmount = amount;
        snapshot.dividendPerToken = amount * 1e18 / snapshot.totalSupply;
        snapshot.finalized = true;
        
        totalDistributed += amount;
        unclaimedDividends += amount;
        
        emit DividendDeposited(snapshotId, amount);
    }
    
    /**
     * @dev 배당금 청구 (투자자가 호출)
     */
    function claimDividend(uint256 snapshotId) external {
        Snapshot memory snapshot = snapshots[snapshotId];
        require(snapshot.finalized, "DividendDistributor: not finalized");
        require(!claimed[snapshotId][msg.sender], "DividendDistributor: already claimed");
        
        uint256 balance = snapshotBalances[snapshotId][msg.sender];
        
        // 스냅샷 기록이 없으면 현재 잔액 사용 (gas 최적화)
        if (balance == 0) {
            balance = token.balanceOf(msg.sender);
        }
        
        require(balance > 0, "DividendDistributor: no balance");
        
        // 배당금 계산
        uint256 dividend = balance * snapshot.dividendPerToken / 1e18;
        require(dividend > 0, "DividendDistributor: zero dividend");
        
        claimed[snapshotId][msg.sender] = true;
        unclaimedDividends -= dividend;
        
        // KRWT 전송
        require(
            paymentToken.transfer(msg.sender, dividend),
            "DividendDistributor: transfer failed"
        );
        
        emit DividendClaimed(snapshotId, msg.sender, dividend);
    }
    
    /**
     * @dev 여러 스냅샷 배당금 한번에 청구
     */
    function claimMultipleDividends(uint256[] calldata _snapshotIds) external {
        uint256 totalDividend = 0;
        
        for (uint256 i = 0; i < _snapshotIds.length; i++) {
            uint256 snapshotId = _snapshotIds[i];
            Snapshot memory snapshot = snapshots[snapshotId];
            
            if (!snapshot.finalized) continue;
            if (claimed[snapshotId][msg.sender]) continue;
            
            uint256 balance = snapshotBalances[snapshotId][msg.sender];
            if (balance == 0) {
                balance = token.balanceOf(msg.sender);
            }
            if (balance == 0) continue;
            
            uint256 dividend = balance * snapshot.dividendPerToken / 1e18;
            if (dividend == 0) continue;
            
            claimed[snapshotId][msg.sender] = true;
            totalDividend += dividend;
            
            emit DividendClaimed(snapshotId, msg.sender, dividend);
        }
        
        require(totalDividend > 0, "DividendDistributor: nothing to claim");
        
        unclaimedDividends -= totalDividend;
        
        // KRWT 전송
        require(
            paymentToken.transfer(msg.sender, totalDividend),
            "DividendDistributor: transfer failed"
        );
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev 청구 가능한 배당금 조회
     */
    function getClaimableDividend(uint256 snapshotId, address holder) 
        external view returns (uint256) 
    {
        Snapshot memory snapshot = snapshots[snapshotId];
        if (!snapshot.finalized) return 0;
        if (claimed[snapshotId][holder]) return 0;
        
        uint256 balance = snapshotBalances[snapshotId][holder];
        if (balance == 0) {
            balance = token.balanceOf(holder);
        }
        
        return balance * snapshot.dividendPerToken / 1e18;
    }
    
    /**
     * @dev 모든 미청구 배당금 조회
     */
    function getTotalClaimable(address holder) external view returns (uint256 total) {
        for (uint256 i = 0; i < snapshotIds.length; i++) {
            uint256 snapshotId = snapshotIds[i];
            Snapshot memory snapshot = snapshots[snapshotId];
            
            if (!snapshot.finalized) continue;
            if (claimed[snapshotId][holder]) continue;
            
            uint256 balance = snapshotBalances[snapshotId][holder];
            if (balance == 0) {
                balance = token.balanceOf(holder);
            }
            
            total += balance * snapshot.dividendPerToken / 1e18;
        }
    }
    
    /**
     * @dev 컨트랙트 KRWT 잔액 조회
     */
    function getContractBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
    
    function getSnapshotIds() external view returns (uint256[] memory) {
        return snapshotIds;
    }
    
    function getSnapshotCount() external view returns (uint256) {
        return snapshotIds.length;
    }
    
    // ============================================
    //            ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @dev 미청구 배당금 회수 (일정 기간 후)
     */
    function withdrawUnclaimed(uint256 snapshotId) external onlyOwner {
        Snapshot memory snapshot = snapshots[snapshotId];
        require(snapshot.finalized, "DividendDistributor: not finalized");
        
        // 1년 이상 지난 경우만
        require(
            block.timestamp > snapshot.timestamp + 365 days,
            "DividendDistributor: too early"
        );
        
        uint256 amount = unclaimedDividends;
        unclaimedDividends = 0;
        
        require(
            paymentToken.transfer(owner, amount),
            "DividendDistributor: transfer failed"
        );
        
        emit UnclaimedWithdrawn(snapshotId, amount);
    }
    
    /**
     * @dev 긴급 출금 (비상용)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(
            paymentToken.transfer(owner, balance),
            "DividendDistributor: transfer failed"
        );
    }
}