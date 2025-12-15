// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/contracts/identity/TrustedIssuersRegistry.sol";
import "../src/contracts/identity/ClaimTopicsRegistry.sol";
import "../src/contracts/identity/IdentityRegistry.sol";
import "../src/contracts/compliance/ModularCompliance.sol";
import "../src/contracts/TokenFactory.sol";

/**
 * @title DeployInfrastructure
 * @notice Nova-Terra 인프라 배포 스크립트 (관리자가 한 번만 실행)
 * @dev 배포 순서:
 *      1. Identity Infrastructure
 *      2. Compliance
 *      3. TokenFactory
 *
 * 배포 후 각 컨트랙트 주소를 저장해두고
 * DeployProperty.s.sol에서 사용합니다.
 */
contract DeployInfrastructure is Script {

    // ============================================
    //              환경 변수
    // ============================================

    address KRWT_ADDRESS = vm.envAddress("KRWT_ADDRESS");

    // ============================================
    //          배포된 컨트랙트 주소
    // ============================================

    TrustedIssuersRegistry public trustedIssuersRegistry;
    ClaimTopicsRegistry public claimTopicsRegistry;
    IdentityRegistry public identityRegistry;
    ModularCompliance public compliance;
    TokenFactory public tokenFactory;

    // ============================================
    //              메인 배포 함수
    // ============================================

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("====================================");
        console.log("Nova-Terra Infrastructure Deployment");
        console.log("====================================");
        console.log("Deployer:", deployer);
        console.log("KRWT Address:", KRWT_ADDRESS);
        console.log("====================================\n");

        vm.startBroadcast(deployerPrivateKey);

        // Phase 1: Identity Infrastructure
        deployIdentityInfrastructure();

        // Phase 2: Compliance
        deployCompliance();

        // Phase 3: TokenFactory
        deployTokenFactory();

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
    //          Phase 2: Compliance 배포
    // ============================================

    function deployCompliance() internal {
        console.log("\n[Phase 2] Deploying Compliance...");

        compliance = new ModularCompliance();
        console.log("  ModularCompliance:", address(compliance));

        console.log("[Phase 2] Compliance deployed!\n");
    }

    // ============================================
    //        Phase 3: TokenFactory 배포
    // ============================================

    function deployTokenFactory() internal {
        console.log("\n[Phase 3] Deploying TokenFactory...");

        tokenFactory = new TokenFactory(
            address(identityRegistry),
            KRWT_ADDRESS
        );
        console.log("  TokenFactory:", address(tokenFactory));

        console.log("[Phase 3] TokenFactory deployed!\n");
    }

    // ============================================
    //            배포 결과 출력
    // ============================================

    function printDeploymentSummary() internal view {
        console.log("\n====================================");
        console.log("Infrastructure Deployment Summary");
        console.log("====================================");
        console.log("\n[Identity Infrastructure]");
        console.log("TrustedIssuersRegistry:", address(trustedIssuersRegistry));
        console.log("ClaimTopicsRegistry:", address(claimTopicsRegistry));
        console.log("IdentityRegistry:", address(identityRegistry));

        console.log("\n[Compliance]");
        console.log("ModularCompliance:", address(compliance));

        console.log("\n[TokenFactory]");
        console.log("TokenFactory:", address(tokenFactory));

        console.log("\n====================================");
        console.log("Infrastructure Deployment Complete!");
        console.log("====================================");

        console.log("\n[IMPORTANT] Save these addresses for DeployProperty.s.sol:");
        console.log("IDENTITY_REGISTRY=", address(identityRegistry));
        console.log("COMPLIANCE=", address(compliance));
        console.log("TOKEN_FACTORY=", address(tokenFactory));
        console.log("====================================\n");
    }
}
