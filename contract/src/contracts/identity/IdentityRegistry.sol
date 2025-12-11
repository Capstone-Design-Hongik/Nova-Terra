// 투자자 지갑 -> ONCHAINID 신원 연결 관리

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IInterfaces.sol";

/**
 * @title IdentityRegistry
 * @dev 지갑 주소 ↔ ONCHAINID 연결 및 투자자 검증
 * 
 * 역할: "이 지갑이 누구 건지, 검증된 투자자인지 알려줄게"
 */
contract IdentityRegistry is IIdentityRegistry {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    
    // 외부 레지스트리 참조
    ITrustedIssuersRegistry public trustedIssuersRegistry;
    IClaimTopicsRegistry public claimTopicsRegistry;
    
    // 등록된 지갑 목록
    address[] private _registeredWallets;
    mapping(address => bool) private _isRegistered;

    // 지갑 => ONCHAINID 주소
    mapping(address => address) private _identities;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event IdentityRegistered(address indexed wallet, address indexed identity);
    event IdentityUpdated(address indexed wallet, address indexed oldIdentity, address indexed newIdentity);
    event IdentityRemoved(address indexed wallet, address indexed identity);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "IdentityRegistry: not owner");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor(
        address _trustedIssuersRegistry,
        address _claimTopicsRegistry
    ) {
        require(_trustedIssuersRegistry != address(0), "IdentityRegistry: zero address");
        require(_claimTopicsRegistry != address(0), "IdentityRegistry: zero address");
        
        owner = msg.sender;
        trustedIssuersRegistry = ITrustedIssuersRegistry(_trustedIssuersRegistry);
        claimTopicsRegistry = IClaimTopicsRegistry(_claimTopicsRegistry);
    }
    
    // ============================================
    //          IDENTITY MANAGEMENT
    // ============================================
    
    /* *
     * @dev 투자자 신원 등록
     * @param wallet 투자자 지갑 주소
     * @param _identity ONCHAINID 컨트랙트 주소
     * @param country 국가 코드 (410 = 한국)
     */
    function registerIdentity(
        address wallet,
        address _identity
    ) external override onlyOwner {
        require(wallet != address(0), "IdentityRegistry: zero wallet");
        require(_identity != address(0), "IdentityRegistry: zero identity");
        require(!_isRegistered[wallet], "IdentityRegistry: already registered");
        
        _identities[wallet] = _identity;
        _registeredWallets.push(wallet);
        _isRegistered[wallet] = true;
        
        emit IdentityRegistered(wallet, _identity);
    }
    
    /**
     * @dev ONCHAINID 주소 변경
     */
    function updateIdentity(address wallet, address newIdentity) 
        external override onlyOwner
    {
        require(_isRegistered[wallet], "IdentityRegistry: not registered");
        require(newIdentity != address(0), "IdentityRegistry: zero identity");
        
        address oldIdentity = _identities[wallet];
        _identities[wallet] = newIdentity;
        
        emit IdentityUpdated(wallet, oldIdentity, newIdentity);
    }
    
    /**
     * @dev 투자자 등록 해제
     */
    function removeIdentity(address wallet) external override onlyOwner {
        require(_isRegistered[wallet], "IdentityRegistry: not registered");
        
        address identityAddr = _identities[wallet];
        
        delete _identities[wallet];
        _isRegistered[wallet] = false;
        
        // 배열에서 제거
        for (uint256 i = 0; i < _registeredWallets.length; i++) {
            if (_registeredWallets[i] == wallet) {
                _registeredWallets[i] = _registeredWallets[_registeredWallets.length - 1];
                _registeredWallets.pop();
                break;
            }
        }
        
        emit IdentityRemoved(wallet, identityAddr);
    }
    
    // ============================================
    //              VERIFICATION
    // ============================================
    
    /**
     * @dev 투자자가 검증되었는지 확인
     * 
     * 검증 로직:
     * 1. 등록된 지갑인가?
     * 2. 필요한 모든 클레임을 보유하고 있는가?
     * 3. 각 클레임의 발행자가 신뢰 기관인가?
     */
    function isVerified(address wallet) external view override returns (bool) {
        // 등록 확인
        if (!_isRegistered[wallet]) return false;
        
        address identityAddr = _identities[wallet];
        IONCHAINID identityContract = IONCHAINID(identityAddr);
        
        // 필요한 클레임 topic 목록 가져오기
        uint256[] memory requiredTopics = claimTopicsRegistry.getClaimTopics();
        
        // 각 topic에 대해 검증
        for (uint256 i = 0; i < requiredTopics.length; i++) {
            uint256 topic = requiredTopics[i]; //kyc, 투자자격, 국가 [1,2,3]
            
            // 1. 클레임 유효한지 (유효기간 포함)
            if (!identityContract.isValidClaim(topic)) {
                return false;
            }
            // 2. issuer 조회
            (address issuer, , , ) = identityContract.getClaim(topic);
            // 3. 발행자가 신뢰 기관인지 확인
            if (!trustedIssuersRegistry.hasClaimTopic(issuer, topic)) {
                return false;
            } 
        }
        
        return true;
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    function identity(address wallet) external view override returns (address) {
        return _identities[wallet];
    }
    
    function contains(address wallet) external view override returns (bool) {
        return _isRegistered[wallet];
    }
    
    function getRegisteredWallets() external view returns (address[] memory) {
        return _registeredWallets;
    }
    
    function getRegisteredCount() external view returns (uint256) {
        return _registeredWallets.length;
    }
    
    // ============================================
    //          REGISTRY REFERENCES
    // ============================================
    
    function setTrustedIssuersRegistry(address registry) external onlyOwner {
        trustedIssuersRegistry = ITrustedIssuersRegistry(registry);
    }
    
    function setClaimTopicsRegistry(address registry) external onlyOwner {
        claimTopicsRegistry = IClaimTopicsRegistry(registry);
    }
}
