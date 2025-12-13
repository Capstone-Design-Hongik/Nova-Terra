// compliance 관리

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../interfaces/IInterfaces.sol";

/**
 * @title ModularCompliance
 * @dev 컴플라이언스 모듈 관리자
 * 
 * 역할: 전송 규칙 검증을 위한 모듈들 관리
 * 모든 모듈이 통과해야 전송 가능
 * 
 * 참고: 실제 모듈 구현은 별도 파일로
 */
contract ModularCompliance is IModularCompliance {
    
    // ============================================
    //                  STATE
    // ============================================
    
    address public owner;
    address public boundToken;// 연결된 PropertyToken 주소
    
    // 등록된 모듈 목록
    address[] private _modules;
    mapping(address => bool) private _isModule;//빠른 검색 위함
    
    // ============================================
    //                  EVENTS
    // ============================================
    
    event ModuleAdded(address indexed module);
    event ModuleRemoved(address indexed module);
    event TokenBound(address indexed token);
    
    // ============================================
    //                MODIFIERS
    // ============================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "ModularCompliance: not owner");
        _;
    }
    
    modifier onlyToken() {
        require(msg.sender == boundToken, "ModularCompliance: not token");
        _;
    }
    
    // ============================================
    //               CONSTRUCTOR
    // ============================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    //          MODULE MANAGEMENT
    // ============================================
    
    /**
     * @dev 컴플라이언스 모듈 추가
     */
    function addModule(address module) external override onlyOwner {
        require(module != address(0), "ModularCompliance: zero address");
        require(!_isModule[module], "ModularCompliance: already added");
        
        _modules.push(module);
        _isModule[module] = true;
        
        emit ModuleAdded(module);
    }
    
    /**
     * @dev 컴플라이언스 모듈 제거
     */
    function removeModule(address module) external override onlyOwner {
        require(_isModule[module], "ModularCompliance: not a module");
        
        // 배열에서 제거
        for (uint256 i = 0; i < _modules.length; i++) {
            if (_modules[i] == module) {
                _modules[i] = _modules[_modules.length - 1];
                _modules.pop();
                break;
            }
        }
        
        _isModule[module] = false;
        
        emit ModuleRemoved(module);
    }
    
    // ============================================
    //          COMPLIANCE CHECK
    // ============================================
    
    /**
     * @dev 전송 가능 여부 확인 (모든 모듈 체크)
     */
    function canTransfer(address from, address to, uint256 amount) 
        external view override returns (bool) 
    {
        // 모듈이 없으면 통과
        if (_modules.length == 0) return true;
        
        // 모든 모듈 확인
        for (uint256 i = 0; i < _modules.length; i++) {
            if (!IComplianceModule(_modules[i]).canTransfer(from, to, amount)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * @dev 전송 후 상태 업데이트 (모든 모듈에 알림)
     */
    function transferred(address from, address to, uint256 amount) 
        external override onlyToken 
    {
        for (uint256 i = 0; i < _modules.length; i++) {
            IComplianceModule(_modules[i]).transferred(from, to, amount);
        }
    }
    
    /**
     * @dev 토큰 생성 후 상태 업데이트
     */
    function created(address to, uint256 amount) external override onlyToken {
        for (uint256 i = 0; i < _modules.length; i++) {
            IComplianceModule(_modules[i]).created(to, amount);
        }
    }
    
    /**
     * @dev 토큰 소각 후 상태 업데이트
     */
    function destroyed(address from, uint256 amount) external override onlyToken {
        for (uint256 i = 0; i < _modules.length; i++) {
            IComplianceModule(_modules[i]).destroyed(from, amount);
        }
    }
    
    // ============================================
    //              VIEW FUNCTIONS
    // ============================================
    
    function getModules() external view override returns (address[] memory) {
        return _modules;
    }
    
    function getModuleCount() external view returns (uint256) {
        return _modules.length;
    }
    
    function isModuleRegistered(address module) external view returns (bool) {
        return _isModule[module];
    }
    
    // ============================================
    //            TOKEN BINDING
    // ============================================
    
    /**
     * @dev 토큰 바인딩 (한 번만 가능)
     */
    function bindToken(address token) external onlyOwner {
        require(boundToken == address(0), "ModularCompliance: already bound");
        require(token != address(0), "ModularCompliance: zero token");
        
        boundToken = token;
        
        emit TokenBound(token);
    }
}
