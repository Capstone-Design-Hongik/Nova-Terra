// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PropertyToken.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title DividendDistributor
 * @dev 임대수익 분배 컨트랙트
 * 
 * 역할: 토큰 보유 비율에 따른 수익 분배
 * 방식: PropertyToken 스냅샷 기반 클레임
 */
contract DividendDistributor {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    PropertyToken public token;
    IERC20 public paymentToken; //KRWT
    
    // 배당 정보
    struct Dividend {
        uint256 snapshotId;         // PropertyToken 스냅샷 ID
        uint256 totalAmount;        // 총 배당금
        uint256 dividendPerToken;   // 토큰당 배당금
        uint256 claimedAmount;      // 청구된 금액 (청구될때마다 ++)
        uint256 timestamp;          // 배당 생성 시간
        bool active;                // 활성화 여부
    }
    
    // 배당 ID => 배당 정보
    mapping(uint256 => Dividend) public dividends;
    
    // 배당 ID => 주소 => 청구 여부
    mapping(uint256 => mapping(address => bool)) public claimed;
    
    // 현재 배당 ID
    uint256 public currentDividendId;
    
    // 배당 ID 목록
    uint256[] public dividendIds;
    
    // 총 분배된 배당금
    uint256 public totalDistributed;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event DividendCreated(uint256 indexed dividendId, uint256 snapshotId, uint256 amount);
    event DividendClaimed(uint256 indexed dividendId, address indexed holder, uint256 amount);
    event UnclaimedWithdrawn(uint256 indexed dividendId, uint256 amount);
    
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
    //          DIVIDEND MANAGEMENT
    // ============================================
    
    /**
     * @dev 배당 생성 및 입금
     *      사전에 PropertyToken.snapshot() 호출 필요!
     *      사전에 paymentToken.approve(이 컨트랙트, amount) 필요!
     * @param snapshotId PropertyToken 스냅샷 ID
     * @param amount 배당금 총액 (KRWT)
     */
    function createDividend(uint256 snapshotId, uint256 amount) external onlyOwner {
        require(amount > 0, "DividendDistributor: zero amount");
        require(snapshotId > 0 && snapshotId <= token.currentSnapshotId(), 
            "DividendDistributor: invalid snapshot");
        
        // KRWT 받기
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "DividendDistributor: transfer failed"
        );
        
        currentDividendId++;
        uint256 dividendId = currentDividendId;
        
        uint256 snapshotTotalSupply = token.totalSupplyAt(snapshotId);
        require(snapshotTotalSupply > 0, "DividendDistributor: no tokens at snapshot");
        
        dividends[dividendId] = Dividend({
            snapshotId: snapshotId, //setting
            totalAmount: amount,  //setting
            dividendPerToken: amount * 1e18 / snapshotTotalSupply,//setting
            claimedAmount: 0,
            timestamp: block.timestamp, //setting
            active: true //setting
        });
        
        dividendIds.push(dividendId);
        totalDistributed += amount;
        
        emit DividendCreated(dividendId, snapshotId, amount);
    }
    
    /**
     * @dev 배당금 청구 (투자자가 호출)
     */
    function claimDividend(uint256 dividendId) external {
        Dividend storage dividend = dividends[dividendId];
        require(dividend.active, "DividendDistributor: not active");
        require(!claimed[dividendId][msg.sender], "DividendDistributor: already claimed");
        
        // PropertyToken에서 스냅샷 시점 잔액 조회
        uint256 balance = token.balanceOfAt(msg.sender, dividend.snapshotId);
        require(balance > 0, "DividendDistributor: no balance at snapshot");
        
        // 배당금 계산
        uint256 amount = balance * dividend.dividendPerToken / 1e18;
        require(amount > 0, "DividendDistributor: zero dividend");
        
        claimed[dividendId][msg.sender] = true;
        dividend.claimedAmount += amount;
        
        // KRWT 전송
        require(
            paymentToken.transfer(msg.sender, amount),
            "DividendDistributor: transfer failed"
        );
        
        emit DividendClaimed(dividendId, msg.sender, amount);
    }
    
    /**
     * @dev 여러 배당금 한번에 청구
     */
    // function claimMultipleDividends(uint256[] calldata _dividendIds) external {
    //     uint256 totalAmount = 0;
        
    //     for (uint256 i = 0; i < _dividendIds.length; i++) {
    //         uint256 dividendId = _dividendIds[i];
    //         Dividend storage dividend = dividends[dividendId];
            
    //         if (!dividend.active) continue;
    //         if (claimed[dividendId][msg.sender]) continue;
            
    //         uint256 balance = token.balanceOfAt(msg.sender, dividend.snapshotId);
    //         if (balance == 0) continue;
            
    //         uint256 amount = balance * dividend.dividendPerToken / 1e18;
    //         if (amount == 0) continue;
            
    //         claimed[dividendId][msg.sender] = true;
    //         dividend.claimedAmount += amount;
    //         totalAmount += amount;
            
    //         emit DividendClaimed(dividendId, msg.sender, amount);
    //     }
        
    //     require(totalAmount > 0, "DividendDistributor: nothing to claim");
        
    //     require(
    //         paymentToken.transfer(msg.sender, totalAmount),
    //         "DividendDistributor: transfer failed"
    //     );
    // }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev 청구 가능한 배당금 조회
     */
    function getClaimableDividend(uint256 dividendId, address holder) 
        external view returns (uint256) 
    {
        Dividend memory dividend = dividends[dividendId];
        if (!dividend.active) return 0;
        if (claimed[dividendId][holder]) return 0;
        
        uint256 balance = token.balanceOfAt(holder, dividend.snapshotId);
        return balance * dividend.dividendPerToken / 1e18;
    }
    
    /**
     * @dev 모든 미청구 배당금 조회
     */
    function getTotalClaimable(address holder) external view returns (uint256 total) {
        for (uint256 i = 0; i < dividendIds.length; i++) {
            uint256 dividendId = dividendIds[i];
            Dividend memory dividend = dividends[dividendId];
            
            if (!dividend.active) continue;
            if (claimed[dividendId][holder]) continue;
            
            uint256 balance = token.balanceOfAt(holder, dividend.snapshotId);
            total += balance * dividend.dividendPerToken / 1e18;
        }
    }
    
    /**
     * @dev 배당 미청구 금액 조회
     */
    function getUnclaimedAmount(uint256 dividendId) external view returns (uint256) {
        Dividend memory dividend = dividends[dividendId];
        return dividend.totalAmount - dividend.claimedAmount;
    }
    
    function getContractBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
    
    function getDividendIds() external view returns (uint256[] memory) {
        return dividendIds;
    }
    
    function getDividendCount() external view returns (uint256) {
        return dividendIds.length;
    }
    
    // ============================================
    //            ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @dev 미청구 배당금 회수 ()
     */
    function withdrawUnclaimed(uint256 dividendId) external onlyOwner {
        Dividend storage dividend = dividends[dividendId];
        require(dividend.active, "DividendDistributor: not active");
        require(
            block.timestamp > dividend.timestamp + 365 days,
            "DividendDistributor: too early"
        );
        
        uint256 unclaimed = dividend.totalAmount - dividend.claimedAmount;
        require(unclaimed > 0, "DividendDistributor: nothing to withdraw");
        
        dividend.active = false;
        
        require(
            paymentToken.transfer(owner, unclaimed),
            "DividendDistributor: transfer failed"
        );
        
        emit UnclaimedWithdrawn(dividendId, unclaimed);
    }
    
    /**
     * @dev 긴급 출금
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(
            paymentToken.transfer(owner, balance),
            "DividendDistributor: transfer failed"
        );
    }
}
