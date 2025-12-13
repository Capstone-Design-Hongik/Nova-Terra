// 토큰 팩토리 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PropertyToken.sol";
import "./interfaces/IInterfaces.sol";

/**
 * @title TokenFactory
 * @dev 부동산별 PropertyToken 배포 및 관리
 */
contract TokenFactory {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    
    // 공용 레지스트리
    address public identityRegistry;
    
    // 결제 토큰 (KRWT)
    address public paymentToken;
    
    // 부동산 정보
    struct PropertyInfo {
        bytes32 propertyId;
        string name;
        string symbol;
        address tokenAddress;
        address complianceAddress;
        address dividendAddress;
        address governanceAddress;
        uint256 totalValue;         // 총 부동산 가치 (KRW)
        uint256 maxSupply;          // 최대 토큰 발행량
        uint256 tokenPrice;         // 토큰당 가격 (KRW)
        uint256 createdAt;
        bool active;
    }
    
    // propertyId => PropertyInfo
    mapping(bytes32 => PropertyInfo) public properties;
    
    // 배포된 부동산 ID 목록
    bytes32[] public propertyIds;
    
    // 토큰 주소 => propertyId
    mapping(address => bytes32) public tokenToProperty;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event PropertyTokenCreated(
        bytes32 indexed propertyId,
        string name,
        string symbol,
        address tokenAddress,
        address complianceAddress,
        uint256 maxSupply,
        uint256 tokenPrice
    );
    
    event PropertyDeactivated(bytes32 indexed propertyId);
    event PaymentTokenUpdated(address oldToken, address newToken);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "TokenFactory: not owner");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor(
        address _identityRegistry,
        address _paymentToken
    ) {
        require(_identityRegistry != address(0), "TokenFactory: zero registry");
        require(_paymentToken != address(0), "TokenFactory: zero payment token");
        
        owner = msg.sender;
        identityRegistry = _identityRegistry;
        paymentToken = _paymentToken;
    }
    
    // ============================================
    //          PROPERTY TOKEN CREATION
    // ============================================
    
    /**
     * @dev 새 부동산 토큰 생성
     * @param name 토큰 이름 (예: "NovaTower Token")
     * @param symbol 토큰 심볼 (예: "NOVA")
     * @param totalValue 부동산 총 가치 (KRW)
     * @param tokenPrice 토큰당 가격 (KRW)
     * @param complianceAddress 사전 배포된 ModularCompliance 주소
     */
    function createPropertyToken(
        string calldata name,
        string calldata symbol,
        uint256 totalValue,
        uint256 tokenPrice,
        address complianceAddress
    ) external onlyOwner returns (address tokenAddress, bytes32 propertyId) {
        require(complianceAddress != address(0), "TokenFactory: zero compliance");
        require(totalValue > 0, "TokenFactory: zero value");
        require(tokenPrice > 0, "TokenFactory: zero price");
        
        // Property ID 생성
        propertyId = keccak256(abi.encodePacked(name, symbol, block.timestamp));
        require(properties[propertyId].tokenAddress == address(0), "TokenFactory: exists");
        
        // maxSupply 계산 (총 가치 / 토큰 가격)
        uint256 maxSupply = totalValue / tokenPrice;
        require(maxSupply > 0, "TokenFactory: zero supply");
        
        // PropertyToken 배포
        PropertyToken token = new PropertyToken(
            name,
            symbol,
            propertyId,
            maxSupply,
            identityRegistry,
            complianceAddress,
            paymentToken,
            tokenPrice
        );
        tokenAddress = address(token);
        
        // 정보 저장
        properties[propertyId] = PropertyInfo({
            propertyId: propertyId,
            name: name,
            symbol: symbol,
            tokenAddress: tokenAddress,
            complianceAddress: complianceAddress,
            dividendAddress: address(0),
            governanceAddress: address(0),
            totalValue: totalValue,
            maxSupply: maxSupply,
            tokenPrice: tokenPrice,
            createdAt: block.timestamp,
            active: true
        });
        
        propertyIds.push(propertyId);
        tokenToProperty[tokenAddress] = propertyId;
        
        emit PropertyTokenCreated(
            propertyId, 
            name, 
            symbol, 
            tokenAddress, 
            complianceAddress,
            maxSupply,
            tokenPrice
        );
    }
    
    // ============================================
    //            PROPERTY MANAGEMENT
    // ============================================
    
    /**
     * @dev 배당 컨트랙트 주소 설정
     */
    function setDividendContract(bytes32 propertyId, address dividendAddress) 
        external onlyOwner 
    {
        require(properties[propertyId].tokenAddress != address(0), "TokenFactory: not found");
        properties[propertyId].dividendAddress = dividendAddress;
    }
    
    /**
     * @dev 거버넌스 컨트랙트 주소 설정
     */
    function setGovernanceContract(bytes32 propertyId, address governanceAddress) 
        external onlyOwner 
    {
        require(properties[propertyId].tokenAddress != address(0), "TokenFactory: not found");
        properties[propertyId].governanceAddress = governanceAddress;
    }
    
    /**
     * @dev 부동산 비활성화
     */
    function deactivateProperty(bytes32 propertyId) external onlyOwner {
        require(properties[propertyId].active, "TokenFactory: not active");
        properties[propertyId].active = false;
        emit PropertyDeactivated(propertyId);
    }
    
    /**
     * @dev 부동산 가치 업데이트 (재평가)
     *      주의: maxSupply는 변경 안 됨 (이미 발행된 토큰 있으니까)
     */
    function updatePropertyValue(bytes32 propertyId, uint256 newValue) 
        external onlyOwner 
    {
        require(properties[propertyId].active, "TokenFactory: not active");
        properties[propertyId].totalValue = newValue;
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    function getProperty(bytes32 propertyId) 
        external view returns (PropertyInfo memory) 
    {
        return properties[propertyId];
    }
    
    function getAllPropertyIds() external view returns (bytes32[] memory) {
        return propertyIds;
    }
    
    function getActiveProperties() external view returns (bytes32[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (properties[propertyIds[i]].active) count++;
        }
        
        bytes32[] memory activeIds = new bytes32[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (properties[propertyIds[i]].active) {
                activeIds[index] = propertyIds[i];
                index++;
            }
        }
        
        return activeIds;
    }
    
    function getPropertyCount() external view returns (uint256) {
        return propertyIds.length;
    }
    
    // ============================================
    //          ADMIN FUNCTIONS
    // ============================================
    
    function setIdentityRegistry(address registry) external onlyOwner {
        require(registry != address(0), "TokenFactory: zero address");
        identityRegistry = registry;
    }
    
    function setPaymentToken(address newPaymentToken) external onlyOwner {
        require(newPaymentToken != address(0), "TokenFactory: zero address");
        address oldToken = paymentToken;
        paymentToken = newPaymentToken;
        emit PaymentTokenUpdated(oldToken, newPaymentToken);
    }
}