// 필요 클레임 종류 정의
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IInterfaces.sol";

/**
 * @title ClaimTopicsRegistry
 * @dev 이 토큰에 투자하려면 어떤 클레임이 필요한지 정의
 * 
 * 역할: "투자하려면 뭐 내야 돼?" 에 대한 답
 * 예시: KYC(1), 적격투자자(2), 국적(3) 필요
 */
contract ClaimTopicsRegistry is IClaimTopicsRegistry {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    
    // 필요한 클레임 topic 목록
    uint256[] private _claimTopics;
    
    // topic 존재 여부 (중복 방지)
    mapping(uint256 => bool) private _topicExists;
    
    // ============================================
    //              TOPIC CONSTANTS
    // ============================================
    
    // 표준 Topic 번호 (프로젝트에서 공통으로 사용-참고용^^)
    uint256 public constant TOPIC_KYC = 1;
    uint256 public constant TOPIC_ACCREDITED_INVESTOR = 2;
    uint256 public constant TOPIC_COUNTRY = 3;
    uint256 public constant TOPIC_AML = 4;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event ClaimTopicAdded(uint256 indexed topic);
    event ClaimTopicRemoved(uint256 indexed topic);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "ClaimTopicsRegistry: not owner");
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
     * @dev 필요한 클레임 topic 추가
     * @param topic 클레임 종류 번호
     */
    function addClaimTopic(uint256 topic) external override onlyOwner {
        require(!_topicExists[topic], "ClaimTopicsRegistry: topic already exists");
        
        _claimTopics.push(topic);
        _topicExists[topic] = true;
        
        emit ClaimTopicAdded(topic);
    }
    
    /**
     * @dev 클레임 topic 제거
     */
    function removeClaimTopic(uint256 topic) external override onlyOwner {
        require(_topicExists[topic], "ClaimTopicsRegistry: topic does not exist");
        
        // 배열에서 제거
        for (uint256 i = 0; i < _claimTopics.length; i++) {
            if (_claimTopics[i] == topic) {
                _claimTopics[i] = _claimTopics[_claimTopics.length - 1];
                _claimTopics.pop();
                break;
            }
        }
        
        _topicExists[topic] = false;
        
        emit ClaimTopicRemoved(topic);
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev 필요한 모든 클레임 topic 반환
     */
    function getClaimTopics() external view override returns (uint256[] memory) {
        return _claimTopics;
    }
    
    /**
     * @dev 특정 topic이 필요한지 확인
     */
    function isRequired(uint256 topic) external view returns (bool) {
        return _topicExists[topic];
    }
    
    /**
     * @dev 필요한 클레임 개수
     */
    function getClaimTopicsCount() external view returns (uint256) {
        return _claimTopics.length;
    }
}
