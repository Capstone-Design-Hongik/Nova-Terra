// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IInterfaces.sol";

/**
 * @title ModularCompliance
 * @dev 컴플라이언스 모듈 관리자 (1:N 구조)
 * 
 * 역할: 여러 PropertyToken의 전송 규칙 검증
 * 토큰별로 다른 모듈 적용 가능
 */
contract ModularCompliance is IModularCompliance {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    
    // 등록된 토큰 목록
    mapping(address => bool) public registeredTokens;
    
    // 토큰별 모듈 목록
    mapping(address => address[]) private _tokenModules;
    mapping(address => mapping(address => bool)) private _isTokenModule;
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event TokenRegistered(address indexed token);
    event TokenUnregistered(address indexed token);
    event ModuleAdded(address indexed token, address indexed module);
    event ModuleRemoved(address indexed token, address indexed module);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "ModularCompliance: not owner");
        _;
    }
    
    modifier onlyRegisteredToken() {
        require(registeredTokens[msg.sender], "ModularCompliance: not registered token");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    //          TOKEN REGISTRATION
    // ============================================
    
    /**
     * @dev 토큰 등록
     */
    function registerToken(address token) external override onlyOwner {
        require(token != address(0), "ModularCompliance: zero address");
        require(!registeredTokens[token], "ModularCompliance: already registered");
        
        registeredTokens[token] = true;
        
        emit TokenRegistered(token);
    }
    
    /**
     * @dev 토큰 등록 해제
     */
    function unregisterToken(address token) external onlyOwner {
        require(registeredTokens[token], "ModularCompliance: not registered");
        
        registeredTokens[token] = false;
        delete _tokenModules[token];
        
        emit TokenUnregistered(token);
    }
    
    // ============================================
    //          MODULE MANAGEMENT
    // ============================================
    
    // addModule, removeModule 함수는 더 이상 사용하지 않음
    // 대신 addModuleForToken, removeModuleForToken 사용
    
    /**
     * @dev 특정 토큰에 모듈 추가
     */
    function addModuleForToken(address token, address module) external override onlyOwner {
        require(registeredTokens[token], "ModularCompliance: token not registered");
        require(module != address(0), "ModularCompliance: zero address");
        require(!_isTokenModule[token][module], "ModularCompliance: already added");
        
        _tokenModules[token].push(module);
        _isTokenModule[token][module] = true;
        
        emit ModuleAdded(token, module);
    }
    
    /**
     * @dev 특정 토큰에서 모듈 제거
     */
    function removeModuleForToken(address token, address module) external override onlyOwner {
        require(_isTokenModule[token][module], "ModularCompliance: not a module");
        
        address[] storage modules = _tokenModules[token];
        for (uint256 i = 0; i < modules.length; i++) {
            if (modules[i] == module) {
                modules[i] = modules[modules.length - 1];
                modules.pop();
                break;
            }
        }
        
        _isTokenModule[token][module] = false;
        
        emit ModuleRemoved(token, module);
    }
    
    // ============================================
    //          COMPLIANCE CHECK
    // ============================================
    
    /**
     * @dev 전송 가능 여부 확인
     */
    function canTransfer(address from, address to, uint256 amount) 
        external view override returns (bool) 
    {
        address token = msg.sender;
        address[] storage modules = _tokenModules[token];
        
        // 모듈 없으면 통과
        if (modules.length == 0) return true;
        
        // 토큰별 모듈 체크
        for (uint256 i = 0; i < modules.length; i++) {
            if (!IComplianceModule(modules[i]).canTransfer(from, to, amount)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * @dev 전송 후 상태 업데이트
     */
    function transferred(address from, address to, uint256 amount) 
        external override onlyRegisteredToken 
    {
        address token = msg.sender;
        address[] storage modules = _tokenModules[token];
        
        for (uint256 i = 0; i < modules.length; i++) {
            IComplianceModule(modules[i]).transferred(from, to, amount);
        }
    }
    
    /**
     * @dev 토큰 생성 후 상태 업데이트
     */
    function created(address to, uint256 amount) external override onlyRegisteredToken {
        address token = msg.sender;
        address[] storage modules = _tokenModules[token];
        
        for (uint256 i = 0; i < modules.length; i++) {
            IComplianceModule(modules[i]).created(to, amount);
        }
    }
    
    /**
     * @dev 토큰 소각 후 상태 업데이트
     */
    function destroyed(address from, uint256 amount) external override onlyRegisteredToken {
        address token = msg.sender;
        address[] storage modules = _tokenModules[token];
        
        for (uint256 i = 0; i < modules.length; i++) {
            IComplianceModule(modules[i]).destroyed(from, amount);
        }
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev 인터페이스 호환용 (빈 배열 반환)
     */
    function getModules() external view override returns (address[] memory) {
        return new address[](0);
    }
    
    /**
     * @dev 특정 토큰의 모듈 목록 반환
     */
    function getModulesForToken(address token) external view override returns (address[] memory) {
        return _tokenModules[token];
    }
    
    function isTokenRegistered(address token) external view returns (bool) {
        return registeredTokens[token];
    }
    
    function isModuleForToken(address token, address module) external view returns (bool) {
        return _isTokenModule[token][module];
    }
}
