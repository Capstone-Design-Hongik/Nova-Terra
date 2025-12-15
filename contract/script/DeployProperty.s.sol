// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/contracts/compliance/ModularCompliance.sol";
import "../src/contracts/compliance/modules/MaxBalanceModule.sol";
import "../src/contracts/TokenFactory.sol";
import "../src/contracts/DividendDistributor.sol";
import "../src/contracts/governance/GovernanceToken.sol";
import "../src/contracts/governance/Governance.sol";

/**
 * @title DeployProperty
 * @notice 부동산별 PropertyToken 배포 스크립트 (백엔드가 부동산마다 실행)
 * @dev 배포 순서:
 *      1. PropertyToken 생성 (via TokenFactory)
 *      2. MaxBalanceModule 배포
 *      3. Application Layer (DividendDistributor, GovernanceToken, Governance)
 *      4. Configuration (모듈 등록, 바인딩, 연결)
 *
 * 사전 조건:
 *      - DeployInfrastructure.s.sol 실행 완료
 *      - COMPLIANCE, TOKEN_FACTORY 주소가 .env에 설정되어 있어야 함
 */
contract DeployProperty is Script {

    // ============================================
    //              환경 변수
    // ============================================

    // 인프라 주소 (DeployInfrastructure.s.sol에서 배포됨)
    address COMPLIANCE_ADDRESS = vm.envAddress("MODULAR_COMPLIANCE");
    address TOKEN_FACTORY_ADDRESS = vm.envAddress("TOKEN_FACTORY");
    address KRWT_ADDRESS = vm.envAddress("KRWT_ADDRESS");

    // PropertyToken 설정
    string PROPERTY_NAME = vm.envString("PROPERTY_NAME");
    string PROPERTY_SYMBOL = vm.envString("PROPERTY_SYMBOL");
    uint256 PROPERTY_VALUE = vm.envUint("PROPERTY_VALUE");
    uint256 TOKEN_PRICE = vm.envUint("TOKEN_PRICE");

    // Compliance Module 설정
    uint256 MAX_BALANCE_PERCENT = vm.envUint("MAX_BALANCE_PERCENT");

    // ============================================
    //          배포된 컨트랙트 주소
    // ============================================

    ModularCompliance public compliance;
    TokenFactory public tokenFactory;
    address public propertyToken;
    uint256 public propertyId;

    MaxBalanceModule public maxBalanceModule;
    DividendDistributor public dividendDistributor;
    GovernanceToken public governanceToken;
    Governance public governance;

    // ============================================
    //              메인 배포 함수
    // ============================================

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("====================================");
        console.log("Nova-Terra Property Deployment");
        console.log("====================================");
        console.log("Deployer:", deployer);
        console.log("Property Name:", PROPERTY_NAME);
        console.log("Property Symbol:", PROPERTY_SYMBOL);
        console.log("====================================\n");

        // 기존 인프라 컨트랙트 로드
        compliance = ModularCompliance(COMPLIANCE_ADDRESS);
        tokenFactory = TokenFactory(TOKEN_FACTORY_ADDRESS);

        console.log("[Infrastructure]");
        console.log("Compliance:", address(compliance));
        console.log("TokenFactory:", address(tokenFactory));
        console.log("KRWT:", KRWT_ADDRESS);
        console.log("");

        vm.startBroadcast(deployerPrivateKey);

        // Phase 1: PropertyToken 생성
        createPropertyToken();

        // Phase 2: MaxBalanceModule 배포
        deployComplianceModule();

        // Phase 3: Application Layer 배포
        deployApplicationLayer();

        // Phase 4: Configuration
        configure();

        vm.stopBroadcast();

        // 배포 결과 출력
        printDeploymentSummary();
    }

    // ============================================
    //      Phase 1: PropertyToken 생성
    // ============================================

    function createPropertyToken() internal {
        console.log("\n[Phase 1] Creating PropertyToken via TokenFactory...");

        (propertyToken, propertyId) = tokenFactory.createPropertyToken(
            PROPERTY_NAME,
            PROPERTY_SYMBOL,
            PROPERTY_VALUE,
            TOKEN_PRICE,
            address(compliance)
        );

        console.log("  PropertyToken created:", propertyToken);
        console.log("  PropertyId:", propertyId);
        console.log("[Phase 1] PropertyToken created!\n");
    }

    // ============================================
    //    Phase 2: Compliance Module 배포
    // ============================================

    function deployComplianceModule() internal {
        console.log("\n[Phase 2] Deploying Compliance Module...");

        // MaxBalanceModule (PropertyToken 주소 필요)
        maxBalanceModule = new MaxBalanceModule(
            address(compliance),
            propertyToken,
            MAX_BALANCE_PERCENT
        );
        console.log("  MaxBalanceModule:", address(maxBalanceModule));

        console.log("[Phase 2] Compliance Module deployed!\n");
    }

    // ============================================
    //      Phase 3: Application Layer 배포
    // ============================================

    function deployApplicationLayer() internal {
        console.log("\n[Phase 3] Deploying Application Layer...");

        // 3-1. DividendDistributor
        dividendDistributor = new DividendDistributor(
            propertyToken,
            KRWT_ADDRESS
        );
        console.log("  DividendDistributor:", address(dividendDistributor));

        // 3-2. GovernanceToken
        governanceToken = new GovernanceToken(propertyToken);
        console.log("  GovernanceToken:", address(governanceToken));

        // 3-3. Governance
        governance = new Governance(address(governanceToken));
        console.log("  Governance:", address(governance));

        console.log("[Phase 3] Application Layer deployed!\n");
    }

    // ============================================
    //          Phase 4: Configuration
    // ============================================

    function configure() internal {
        console.log("\n[Phase 4] Configuring contracts...");

        // 4-1. Compliance에 MaxBalanceModule 등록
        compliance.addModule(address(maxBalanceModule));
        console.log("  MaxBalanceModule added to Compliance");

        // 4-2. Compliance를 PropertyToken에 바인딩
        compliance.bindToken(propertyToken);
        console.log("  Compliance bound to PropertyToken");

        // 4-3. PropertyToken 주소로 실제 propertyId 조회
        uint256 actualPropertyId = tokenFactory.tokenToProperty(propertyToken);
        console.log("  Actual PropertyId:", actualPropertyId);

        // 4-4. TokenFactory에 DividendDistributor 연결
        tokenFactory.setDividendContract(actualPropertyId, address(dividendDistributor));
        console.log("  DividendDistributor linked to PropertyToken");

        // 4-5. TokenFactory에 Governance 연결
        tokenFactory.setGovernanceContract(actualPropertyId, address(governance));
        console.log("  Governance linked to PropertyToken");

        console.log("[Phase 4] Configuration complete!\n");
    }

    // ============================================
    //            배포 결과 출력
    // ============================================

    function printDeploymentSummary() internal view {
        console.log("\n====================================");
        console.log("Property Deployment Summary");
        console.log("====================================");
        console.log("\n[PropertyToken]");
        console.log("PropertyToken:", propertyToken);
        console.log("Name:", PROPERTY_NAME);
        console.log("Symbol:", PROPERTY_SYMBOL);

        console.log("\n[Compliance Module]");
        console.log("MaxBalanceModule:", address(maxBalanceModule));

        console.log("\n[Application Layer]");
        console.log("DividendDistributor:", address(dividendDistributor));
        console.log("GovernanceToken:", address(governanceToken));
        console.log("Governance:", address(governance));

        console.log("\n====================================");
        console.log("Property Deployment Complete!");
        console.log("====================================");

        console.log("\n[IMPORTANT] Save these addresses to your database:");
        console.log("PROPERTY_TOKEN=", propertyToken);
        console.log("MAX_BALANCE_MODULE=", address(maxBalanceModule));
        console.log("DIVIDEND_DISTRIBUTOR=", address(dividendDistributor));
        console.log("GOVERNANCE_TOKEN=", address(governanceToken));
        console.log("GOVERNANCE=", address(governance));
        console.log("====================================\n");
    }
}
