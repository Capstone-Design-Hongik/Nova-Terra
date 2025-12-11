// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IInterfaces.sol";

interface IDojangScroll {
    function isVerified(address addr, bytes32 attesterId) external view returns (bool);
}

/**
 * @title ONCHAINID
 * @dev 투자자 1명당 1개씩 배포되는 신원 증명 컨트랙트
 *      KYC는 Giwa Chain에서 실시간 조회, 나머지는 자체 저장
 */
contract ONCHAINID is IONCHAINID {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    /*
    // Giwa Chain
    address constant DOJANG_SCROLL = 0xd5077b67dcb56caC8b270C7788FC3E6ee03F17B9;
    bytes32 constant UPBIT_KOREA = 0xd99b42e778498aa3c9c1f6a012359130252780511687a35982e8e52735453034;
    
    // Topic 상수
    uint256 public constant TOPIC_KYC = 1;
    */
    // topic => Claim
    mapping(uint256 => Claim) private claims;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event ClaimAdded(uint256 indexed topic, address indexed issuer);
    event ClaimRemoved(uint256 indexed topic);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "ONCHAINID: not owner");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor(address _owner) {
        require(_owner != address(0), "ONCHAINID: zero address");
        owner = _owner;
    }
    
    // ============================================
    //            CLAIM MANAGEMENT
    // ============================================
    
    /**
     * @dev 클레임 추가 (KYC 제외 아직 아님)
     *      msg.sender가 issuer로 저장됨
     */
    function addClaim(
        uint256 topic,
        bytes calldata data,
        uint256 validFrom,
        uint256 validTo
    ) external {
        //require(topic != TOPIC_KYC, "ONCHAINID: KYC is from Giwa Chain");
        // issuer 검증. 


        claims[topic] = Claim({
            issuer: msg.sender,
            data: data,
            validFrom: validFrom,
            validTo: validTo
        });
        
        emit ClaimAdded(topic, msg.sender);
    }
    
    /**
     * @dev 클레임 제거
     */
    function removeClaim(uint256 topic) external onlyOwner {
        //require(topic != TOPIC_KYC, "ONCHAINID: cannot remove KYC");
        require(claims[topic].issuer != address(0), "ONCHAINID: not exist");
        
        delete claims[topic];
        
        emit ClaimRemoved(topic);
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev 클레임 조회 (통합 getter)
     */
    function getClaim(uint256 topic) external view returns (
        address issuer,
        bytes memory data,
        uint256 validFrom,
        uint256 validTo
    ) {
        // if (topic == TOPIC_KYC) {
        //     return (DOJANG_SCROLL, "", 0, 0);
        // }
        
        Claim memory c = claims[topic];
        return (c.issuer, c.data, c.validFrom, c.validTo);
    }
    
    /**
     * @dev 클레임 존재 여부
     */
    function hasClaim(uint256 topic) external view returns (bool) {
        // if (topic == TOPIC_KYC) {
        //     return true;  // KYC는 항상 조회 가능
        // }
        
        return claims[topic].issuer != address(0);
    }
    
    /**
     * @dev 클레임 유효성 체크
     *      - KYC: Giwa Chain 실시간 조회
     *      - 나머지: 유효기간 체크
     *      - issuer 신뢰 여부는 IdentityRegistry에서 판단
     */
    function isValidClaim(uint256 topic) external view returns (bool) {
        // if (topic == TOPIC_KYC) {
        //     return IDojangScroll(DOJANG_SCROLL).isVerified(owner, UPBIT_KOREA);
        // }
        
        Claim memory c = claims[topic];
        
        if (c.issuer == address(0)) return false;
        if (c.validFrom > block.timestamp) return false;
        if (c.validTo != 0 && c.validTo < block.timestamp) return false;
        
        return true;
    }
}