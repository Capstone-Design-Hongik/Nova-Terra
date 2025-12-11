// 신뢰하는 Claim 발행자 주소 관리

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../interfaces/IInterfaces.sol";

/**
 * @title TrustedIssuersRegistry
 * @dev 클레임을 발행할 수 있는 신뢰 기관 관리
 * 
 * 역할: "이 서류 발급은 누가 해줘?" 에 대한 답
 * 예시: KYC는 신한은행, 미래에셋 / 적격투자자는 금융위원회만
 */
contract TrustedIssuersRegistry is ITrustedIssuersRegistry {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    
    // 등록된 신뢰 발행자 목록
    address[] private _trustedIssuers;
    
    // 발행자 => 등록 여부 (매핑으로 검색 속도 향상)
    mapping(address => bool) private _isTrusted;
    
    // 발행자 => 발행 가능한 topic 목록
    mapping(address => uint256[]) private _issuerClaimTopics;
    
    // 발행자 => topic => 발행 가능 여부 (매핑으로 검색 속도 향상)
    mapping(address => mapping(uint256 => bool)) private _issuerHasTopic;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event TrustedIssuerAdded(address indexed issuer, uint256[] claimTopics);
    event TrustedIssuerRemoved(address indexed issuer);
    event ClaimTopicsUpdated(address indexed issuer, uint256[] claimTopics);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "TrustedIssuersRegistry: not owner");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    //            ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @dev 신뢰 발행자 추가
     * @param issuer 발행 기관 주소
     * @param claimTopics 발행 가능한 클레임 종류들
     * 
     * 예시: addTrustedIssuer(신한은행, [1, 3]) → KYC, 국적 발행 가능
     */
    function addTrustedIssuer(address issuer, uint256[] calldata claimTopics) 
        external override onlyOwner 
    {
        require(issuer != address(0), "TrustedIssuersRegistry: zero address");
        require(!_isTrusted[issuer], "TrustedIssuersRegistry: already trusted");
        require(claimTopics.length > 0, "TrustedIssuersRegistry: no topics");
        
        _trustedIssuers.push(issuer);
        _isTrusted[issuer] = true;
        _issuerClaimTopics[issuer] = claimTopics;
        
        // topic별 매핑 설정
        for (uint256 i = 0; i < claimTopics.length; i++) {
            _issuerHasTopic[issuer][claimTopics[i]] = true;
        }
        
        emit TrustedIssuerAdded(issuer, claimTopics);
    }
    
    /**
     * @dev 신뢰 발행자 제거
     */
    function removeTrustedIssuer(address issuer) external override onlyOwner {
        require(_isTrusted[issuer], "TrustedIssuersRegistry: not trusted");
        
        // 배열에서 제거
        for (uint256 i = 0; i < _trustedIssuers.length; i++) {
            if (_trustedIssuers[i] == issuer) {
                _trustedIssuers[i] = _trustedIssuers[_trustedIssuers.length - 1];
                _trustedIssuers.pop();
                break;
            }
        }
        
        // topic 매핑 제거
        uint256[] memory topics = _issuerClaimTopics[issuer];
        for (uint256 i = 0; i < topics.length; i++) {
            _issuerHasTopic[issuer][topics[i]] = false;
        }
        
        _isTrusted[issuer] = false;
        delete _issuerClaimTopics[issuer];
        
        emit TrustedIssuerRemoved(issuer);
    }
    
    /**
     * @dev 발행자의 발행 가능 topic 업데이트
     */
    function updateIssuerClaimTopics(address issuer, uint256[] calldata claimTopics) 
        external override onlyOwner 
    {
        require(_isTrusted[issuer], "TrustedIssuersRegistry: not trusted");
        
        // 기존 topic 매핑 제거
        uint256[] memory oldTopics = _issuerClaimTopics[issuer];
        for (uint256 i = 0; i < oldTopics.length; i++) {
            _issuerHasTopic[issuer][oldTopics[i]] = false;
        }
        
        // 새 topic 설정
        _issuerClaimTopics[issuer] = claimTopics;
        for (uint256 i = 0; i < claimTopics.length; i++) {
            _issuerHasTopic[issuer][claimTopics[i]] = true;
        }
        
        emit ClaimTopicsUpdated(issuer, claimTopics);
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    function isTrustedIssuer(address issuer) external view override returns (bool) {
        return _isTrusted[issuer];
    }
    
    function getTrustedIssuerClaimTopics(address issuer) 
        external view override returns (uint256[] memory) 
    {
        return _issuerClaimTopics[issuer];
    }
    
    /**
     * @dev 특정 발행자가 특정 topic 발행 가능한지
     * 
     * 예시: hasClaimTopic(신한은행, 1) → true (KYC 발행 가능)
     */
    function hasClaimTopic(address issuer, uint256 topic) 
        external view override returns (bool) 
    {
        return _issuerHasTopic[issuer][topic];
    }
    
    function getTrustedIssuers() external view override returns (address[] memory) {
        return _trustedIssuers;
    }
    
    function getTrustedIssuersCount() external view returns (uint256) {
        return _trustedIssuers.length;
    }
}
