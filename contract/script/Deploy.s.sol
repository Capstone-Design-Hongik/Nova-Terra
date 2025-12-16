// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/contracts/identity/TrustedIssuersRegistry.sol";
import "../src/contracts/identity/ClaimTopicsRegistry.sol";
import "../src/contracts/identity/IdentityRegistry.sol";
import "../src/contracts/compliance/ModularCompliance.sol";
import "../src/contracts/compliance/modules/MaxBalanceModule.sol";
import "../src/contracts/TokenFactory.sol";
import "../src/contracts/DividendDistributor.sol";
import "../src/contracts/governance/GovernanceToken.sol";
import "../src/contracts/governance/Governance.sol";

/**
 * @title Deploy
 * @notice Nova-Terra 전체 시스템 배포 스크립트
 * @dev 배포 순서:
 *      1. Identity Infrastructure
 *      2. Compliance + TokenFactory
 *      3. PropertyToken 생성 (via TokenFactory)
 *      4. MaxBalanceModule (PropertyToken 주소 필요)
 *      5. Application Layer (Dividend, Governance)
 *      6. Configuration (모듈 등록, 바인딩)
 */
contract Deploy is Script {

    // ============================================
    //              환경 변수
    // ============================================

    address KRWT_ADDRESS = vm.envAddress("KRWT_ADDRESS");
    string PROPERTY_NAME = vm.envString("PROPERTY_NAME");
    string PROPERTY_SYMBOL = vm.envString("PROPERTY_SYMBOL");
    uint256 PROPERTY_VALUE = vm.envUint("PROPERTY_VALUE");  // 총 부동산 가치 (예: 10000000000 = 100억)
    uint256 TOKEN_PRICE = vm.envUint("TOKEN_PRICE");        // 토큰당 가격 (예: 1000000 = 100만원)
    uint256 MAX_BALANCE_PERCENT = vm.envUint("MAX_BALANCE_PERCENT"); // 최대 보유 비율 (예: 1000 = 10%)

    // ============================================
    //          배포된 컨트랙트 주소
    // ============================================

    // Phase 1: Identity
    TrustedIssuersRegistry trustedIssuersRegistry;
    ClaimTopicsRegistry claimTopicsRegistry;
    IdentityRegistry identityRegistry;

    // Phase 2: Compliance + Factory
    ModularCompliance compliance;
    TokenFactory tokenFactory;
    address propertyToken;
    uint256 propertyId;

    // Phase 3: Compliance Module
    MaxBalanceModule maxBalanceModule;

    // Phase 4: Application Layer
    DividendDistributor dividendDistributor;
    GovernanceToken governanceToken;
    Governance governance;

    // ============================================
    //              메인 배포 함수
    // ============================================

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("====================================");
        console.log("Nova-Terra Deployment Script");
        console.log("====================================");
        console.log("Deployer:", deployer);
        console.log("KRWT Address:", KRWT_ADDRESS);
        console.log("Property Name:", PROPERTY_NAME);
        console.log("Property Symbol:", PROPERTY_SYMBOL);
        console.log("====================================\n");

        vm.startBroadcast(deployerPrivateKey);

        // Phase 1: Identity Infrastructure
        deployIdentityInfrastructure();

        // Phase 2: Compliance + TokenFactory + PropertyToken
        deployComplianceAndToken();

        // Phase 3: MaxBalanceModule (PropertyToken 주소 필요)
        deployComplianceModules();

        // Phase 4: Application Layer
        deployApplicationLayer();

        // Phase 5: Configuration
        configure();

        vm.stopBroadcast();

        // 배포 결과 출력
        printDeploymentSummary();
    }

    // ============================================
    //          Phase 1: Identity 배포
    // ============================================

    function deployIdentityInfrastructure() internal {
        console.log("\n[Phase 1] Deploying Identity Infrastructure...");

        // 1-1. TrustedIssuersRegistry
        trustedIssuersRegistry = new TrustedIssuersRegistry();
        console.log("  TrustedIssuersRegistry:", address(trustedIssuersRegistry));

        // 1-2. ClaimTopicsRegistry
        claimTopicsRegistry = new ClaimTopicsRegistry();
        console.log("  ClaimTopicsRegistry:", address(claimTopicsRegistry));

        // 1-3. IdentityRegistry
        identityRegistry = new IdentityRegistry(
            address(trustedIssuersRegistry),
            address(claimTopicsRegistry)
        );
        console.log("  IdentityRegistry:", address(identityRegistry));

        console.log("[Phase 1] Identity Infrastructure deployed!\n");
    }

    // ============================================
    //    Phase 2: Compliance + Token 배포
    // ============================================

    function deployComplianceAndToken() internal {
        console.log("\n[Phase 2] Deploying Compliance + TokenFactory + PropertyToken...");

        // 2-1. ModularCompliance
        compliance = new ModularCompliance();
        console.log("  ModularCompliance:", address(compliance));

        // 2-2. TokenFactory
        tokenFactory = new TokenFactory(
            address(identityRegistry),
            KRWT_ADDRESS
        );
        console.log("  TokenFactory:", address(tokenFactory));

        // 2-3. PropertyToken 생성 (via TokenFactory)
        (propertyToken, propertyId) = tokenFactory.createPropertyToken(
            PROPERTY_NAME,
            PROPERTY_SYMBOL,
            PROPERTY_VALUE,
            TOKEN_PRICE,
            address(compliance)
        );
        console.log("  PropertyToken:", propertyToken);
        console.log("  PropertyId:", propertyId);

        console.log("[Phase 2] Compliance + Token deployed!\n");
    }

    // ============================================
    //    Phase 3: Compliance Modules 배포
    // ============================================

    function deployComplianceModules() internal {
        console.log("\n[Phase 3] Deploying Compliance Modules...");

        // MaxBalanceModule (PropertyToken 주소 필요)
        maxBalanceModule = new MaxBalanceModule(
            address(compliance),
            propertyToken,
            MAX_BALANCE_PERCENT
        );
        console.log("  MaxBalanceModule:", address(maxBalanceModule));

        console.log("[Phase 3] Compliance Modules deployed!\n");
    }

    // ============================================
    //      Phase 4: Application Layer 배포
    // ============================================

    function deployApplicationLayer() internal {
        console.log("\n[Phase 4] Deploying Application Layer...");

        // 4-1. DividendDistributor
        dividendDistributor = new DividendDistributor(
            propertyToken,
            KRWT_ADDRESS
        );
        console.log("  DividendDistributor:", address(dividendDistributor));

        // 4-2. GovernanceToken
        governanceToken = new GovernanceToken(propertyToken);
        console.log("  GovernanceToken:", address(governanceToken));

        // 4-3. Governance
        governance = new Governance(address(governanceToken));
        console.log("  Governance:", address(governance));

        console.log("[Phase 4] Application Layer deployed!\n");
    }

    // ============================================
    //          Phase 5: Configuration
    // ============================================

    function configure() internal {
        console.log("\n[Phase 5] Configuring contracts...");

        // 5-1. PropertyToken을 Compliance에 등록
        compliance.registerToken(propertyToken);
        console.log("  PropertyToken registered to Compliance");

        // 5-2. Compliance에 MaxBalanceModule 등록
        compliance.addModuleForToken(propertyToken, address(maxBalanceModule));
        console.log("  MaxBalanceModule added to PropertyToken");

        // 5-3. PropertyToken 주소로 실제 propertyId 조회
        uint256 actualPropertyId = tokenFactory.tokenToProperty(propertyToken);
        console.log("  Actual PropertyId:", actualPropertyId);

        // 5-4. TokenFactory에 DividendDistributor 연결
        tokenFactory.setDividendContract(actualPropertyId, address(dividendDistributor));
        console.log("  DividendDistributor linked to PropertyToken");

        // 5-5. TokenFactory에 Governance 연결
        tokenFactory.setGovernanceContract(actualPropertyId, address(governance));
        console.log("  Governance linked to PropertyToken");

        console.log("[Phase 5] Configuration complete!\n");
    }

    // ============================================
    //            배포 결과 출력
    // ============================================

    function printDeploymentSummary() internal view {
        console.log("\n====================================");
        console.log("Deployment Summary");
        console.log("====================================");
        console.log("\n[Identity Infrastructure]");
        console.log("TrustedIssuersRegistry:", address(trustedIssuersRegistry));
        console.log("ClaimTopicsRegistry:", address(claimTopicsRegistry));
        console.log("IdentityRegistry:", address(identityRegistry));

        console.log("\n[Compliance]");
        console.log("ModularCompliance:", address(compliance));
        console.log("MaxBalanceModule:", address(maxBalanceModule));

        console.log("\n[Token]");
        console.log("TokenFactory:", address(tokenFactory));
        console.log("PropertyToken:", propertyToken);

        console.log("\n[Application Layer]");
        console.log("DividendDistributor:", address(dividendDistributor));
        console.log("GovernanceToken:", address(governanceToken));
        console.log("Governance:", address(governance));

        console.log("\n====================================");
        console.log("Deployment Complete!");
        console.log("====================================\n");
    }
}
