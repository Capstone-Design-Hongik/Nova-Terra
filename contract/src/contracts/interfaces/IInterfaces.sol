// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// ============================================
//              IDENTITY INTERFACES
// ============================================

interface IONCHAINID {
    struct Claim {
        address issuer;
        bytes data; 
        uint256 validFrom; // 클레임 유효 시작 시간 (타임스탬프)
        uint256 validTo; // 클레임 유효 종료 시간 (타임스탬프)
    }
    
    function addClaim(
        uint256 topic,
        bytes calldata data,
        uint256 validFrom,
        uint256 validTo
    ) external;
    
    function removeClaim(uint256 topic) external;

    // 클레임 조회 (통합 getter)
    function getClaim(uint256 topic) external view returns (
        address issuer,
        bytes memory data,
        uint256 validFrom,
        uint256 validTo
    );
    function hasClaim(uint256 topic) external view returns (bool);
    function isValidClaim(uint256 topic) external view returns (bool);
    function owner() external view returns (address);
}

interface IIdentityRegistry {
    function registerIdentity(
        address wallet,
        address identity
    ) external;
    
    function updateIdentity(address wallet, address newIdentity) external;
    function removeIdentity(address wallet) external;
    function isVerified(address wallet) external view returns (bool);
    function identity(address wallet) external view returns (address);
    function contains(address wallet) external view returns (bool);
}

interface ITrustedIssuersRegistry {
    function addTrustedIssuer(address issuer, uint256[] calldata claimTopics) external;
    function removeTrustedIssuer(address issuer) external;
    function updateIssuerClaimTopics(address issuer, uint256[] calldata claimTopics) external;
    function isTrustedIssuer(address issuer) external view returns (bool);
    function getTrustedIssuerClaimTopics(address issuer) external view returns (uint256[] memory);
    function hasClaimTopic(address issuer, uint256 topic) external view returns (bool);
    function getTrustedIssuers() external view returns (address[] memory);
}

interface IClaimTopicsRegistry {
    function addClaimTopic(uint256 topic) external;
    function removeClaimTopic(uint256 topic) external;
    function getClaimTopics() external view returns (uint256[] memory);
}

// ============================================
//            COMPLIANCE INTERFACES
// ============================================

interface IModularCompliance {
    function addModule(address module) external;
    function removeModule(address module) external;
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
    function transferred(address from, address to, uint256 amount) external;
    function created(address to, uint256 amount) external;
    function destroyed(address from, uint256 amount) external;
    function getModules() external view returns (address[] memory);
}

interface IComplianceModule {
    function canTransfer(address from, address to, uint256 amount) external view returns (bool); //propertyToken 전송 가능여부 체크
    function transferred(address from, address to, uint256 amount) external; //propertyToken 전송되엇을때 모듈에서 기록할 것들 구현
    function created(address to, uint256 amount) external; //mint,buy 시 호출
    function destroyed(address from, uint256 amount) external; // 
}

 
// ============================================
//              TOKEN INTERFACES
// ============================================

interface IPropertyToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function pause() external;
    function unpause() external;
    function setIdentityRegistry(address registry) external;
    function setCompliance(address compliance) external;

    // ERC20 표준 함수
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function maxSupply() external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // 스냅샷 함수 (배당 분배용)
    function currentSnapshotId() external view returns (uint256);
    function balanceOfAt(address account, uint256 snapshotId) external view returns (uint256);
    function totalSupplyAt(uint256 snapshotId) external view returns (uint256);
}
