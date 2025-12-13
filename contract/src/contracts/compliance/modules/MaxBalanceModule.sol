// 보유비율 제한 모듈
/**
문제: 한 명이 51% 가지면 거버넌스 독재
해결: 예) 최대 10%까지만 보유 가능
 */


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../interfaces/IInterfaces.sol";

/**
 * @title MaxBalanceModule
 * @dev 보유비율 제한
 *      한 주소가 전체 토큰의 X% 이상 보유 불가
 */
contract MaxBalanceModule is IComplianceModule {
    
    address public owner;
    address public compliance;
    address public token;//property token 주소
    
    // 최대 보유 비율 (10000 = 100%, 1000 = 10%)
    uint256 public maxBalancePercent;
    
    // 면제 주소 (거래소, 발행사 등)
    mapping(address => bool) public exempted;
    
    event MaxBalanceUpdated(uint256 oldPercent, uint256 newPercent);
    event ExemptionSet(address indexed account, bool status);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "MaxBalanceModule: not owner");
        _;
    }
    
    modifier onlyCompliance() {
        require(msg.sender == compliance, "MaxBalanceModule: not compliance");
        _;
    }
    
    /**
     * @param _compliance ModularCompliance 주소
     * @param _token PropertyToken 주소
     * @param _maxBalancePercent 최대 보유 비율 (1000 = 10%)
     */
    constructor(
        address _compliance, 
        address _token,
        uint256 _maxBalancePercent
    ) {
        require(_maxBalancePercent <= 10000, "MaxBalanceModule: invalid percent");
        
        owner = msg.sender;
        compliance = _compliance;
        token = _token;
        maxBalancePercent = _maxBalancePercent;
    }
    
    // ============================================
    //            COMPLIANCE CHECK
    // ============================================
    
    function canTransfer(address from, address to, uint256 amount) 
        external view override returns (bool) 
    {
        // 면제 주소면 통과
        if (exempted[to]) return true;
        
        // 현재 잔액 + 받을 양
        uint256 newBalance = IPropertyToken(token).balanceOf(to) + amount;
        
        // 최대 허용량 계산
        uint256 maxAllowed = (IPropertyToken(token).maxSupply() * maxBalancePercent) / 10000;
        
        if (newBalance > maxAllowed) {
            return false;
        }
        
        return true;
    }
    
    function transferred(address from, address to, uint256 amount) 
        external override onlyCompliance 
    {
        // 전송 후 특별히 할 것 없음
    }
    
    function created(address to, uint256 amount) 
        external override onlyCompliance 
    {
        // 발행 후 특별히 할 것 없음
    }
    
    function destroyed(address from, uint256 amount) 
        external override onlyCompliance 
    {
        // 소각 후 특별히 할 것 없음
    }
    
    // ============================================
    //            ADMIN FUNCTIONS
    // ============================================
    
    function setMaxBalancePercent(uint256 newPercent) external onlyOwner {
        require(newPercent <= 10000, "MaxBalanceModule: invalid percent");
        uint256 oldPercent = maxBalancePercent;
        maxBalancePercent = newPercent;
        emit MaxBalanceUpdated(oldPercent, newPercent);
    }
    
    function setExemption(address account, bool status) external onlyOwner {
        exempted[account] = status;
        emit ExemptionSet(account, status);
    }
    
    // ============================================
    //            VIEW FUNCTIONS
    // ============================================
    
    function getMaxBalance() external view returns (uint256) {
        return (IPropertyToken(token).maxSupply() * maxBalancePercent) / 10000;
    }
    
    function getRemainingAllowance(address account) external view returns (uint256) {
        uint256 maxAllowed = (IPropertyToken(token).maxSupply() * maxBalancePercent) / 10000;
        uint256 currentBalance = IPropertyToken(token).balanceOf(account);
        
        if (currentBalance >= maxAllowed) return 0;
        return maxAllowed - currentBalance;
    }
}