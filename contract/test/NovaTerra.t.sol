// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";

// Identity
import "../src/contracts/identity/TrustedIssuersRegistry.sol";
import "../src/contracts/identity/ClaimTopicsRegistry.sol";
import "../src/contracts/identity/IdentityRegistry.sol";
import "../src/contracts/identity/ONCHAINID.sol";

// Compliance
import "../src/contracts/compliance/ModularCompliance.sol";
// import "../src/contracts/compliance/modules/LockupModule.sol";
import "../src/contracts/compliance/modules/MaxBalanceModule.sol";
// import "../src/contracts/compliance/modules/MaxInvestmentModule.sol";

// Core
import "../src/contracts/TokenFactory.sol";
import "../src/contracts/PropertyToken.sol";
import "../src/contracts/DividendDistributor.sol";
import "../src/KRWT.sol";

/**
 * @title NovaTerra Integration Test (Simple)
 * @dev 발행사 + 투자자 2명으로 단순화
 */
contract NovaTerraIntegrationTest is Test {
    
    // ============================================
    //              CONTRACTS
    // ============================================
    
    KRWT public krwt;
    TrustedIssuersRegistry public trustedIssuers;
    ClaimTopicsRegistry public claimTopics;
    IdentityRegistry public identityRegistry;
    ModularCompliance public compliance;
    // LockupModule public lockupModule;
    TokenFactory public tokenFactory;
    PropertyToken public propertyToken;
    DividendDistributor public dividendDistributor;
    
    ONCHAINID public investor1Identity;
    ONCHAINID public investor2Identity;
    
    // ============================================
    //              USERS
    // ============================================
    
    address public admin = address(1);           // 발행사 (증권사)
    address public trustedIssuer = address(2);   // KYC 발급 기관
    address public investor1 = address(3);       // 투자자1
    address public investor2 = address(4);       // 투자자2
    
    // ============================================
    //              CONSTANTS
    // ============================================
    
    uint256 public constant TOTAL_VALUE = 10_000_000_000; // 100억 원
    uint256 public constant TOKEN_PRICE = 1_000_000;       // 100만 원
    // uint256 public constant LOCKUP_PERIOD = 0;             // 데모용: 락업 없음
    
    bytes32 public propertyId;
    
    // ============================================
    //              SETUP
    // ============================================
    
    function setUp() public {
        vm.startPrank(admin);
        
        // ========== Phase 1: 인프라 배포 ==========
        
        krwt = new KRWT();
        trustedIssuers = new TrustedIssuersRegistry();
        claimTopics = new ClaimTopicsRegistry();
        identityRegistry = new IdentityRegistry(
            address(trustedIssuers),
            address(claimTopics)
        );
        
        // 신뢰 기관 등록
        uint256[] memory topics = new uint256[](1);
        topics[0] = 1; // KYC
        trustedIssuers.addTrustedIssuer(trustedIssuer, topics);
        claimTopics.addClaimTopic(1);  // KYC만 필요
        // ========== Phase 2: 부동산 토큰 배포 ==========
        
        compliance = new ModularCompliance();
        // lockupModule = new LockupModule(address(compliance), LOCKUP_PERIOD);
        
        tokenFactory = new TokenFactory(
            address(identityRegistry),
            address(krwt)
        );
        
        (address tokenAddress, bytes32 _propertyId) = tokenFactory.createPropertyToken(
            "Gangnam Tower Token",
            "GANG",
            TOTAL_VALUE,
            TOKEN_PRICE,
            address(compliance)
        );
        propertyToken = PropertyToken(tokenAddress);
        propertyId = _propertyId;
        
        dividendDistributor = new DividendDistributor(
            address(propertyToken),
            address(krwt)
        );
        
        // ========== Phase 3: 설정 ==========
        
        // compliance.addModule(address(lockupModule));
        compliance.bindToken(address(propertyToken));
        tokenFactory.setDividendContract(propertyId, address(dividendDistributor));
        
        // ========== Phase 4: 투자자 온보딩 ==========
        
        investor1Identity = new ONCHAINID(investor1);
        investor2Identity = new ONCHAINID(investor2);
        
        vm.stopPrank();
        
        // KYC Claim 발급
        vm.startPrank(trustedIssuer);
        uint256 validFrom = block.timestamp;
        uint256 validTo = block.timestamp + 365 days;
        investor1Identity.addClaim(1, 'kr', validFrom, validTo);
        investor2Identity.addClaim(1, 'kr', validFrom, validTo);
        vm.stopPrank();
        
        // IdentityRegistry 등록
        vm.startPrank(admin);
        identityRegistry.registerIdentity(investor1, address(investor1Identity));
        identityRegistry.registerIdentity(investor2, address(investor2Identity));
        
        // 초기 발행 (판매 준비)
        propertyToken.initialMint(admin, 0);
        
        // KRWT 지급 (테스트용)
        krwt.mint(admin, 1_000_000_000 * 1e18);
        krwt.mint(investor1, 100_000_000 * 1e18);
        krwt.mint(investor2, 100_000_000 * 1e18);
        vm.stopPrank();
    }
    
    // ============================================
    //              TESTS
    // ============================================
    
    function test_DeploymentSuccess() public view {
        assertTrue(address(propertyToken) != address(0));
        assertTrue(address(dividendDistributor) != address(0));
        assertEq(propertyToken.name(), "Gangnam Tower Token");
    }
    
    function test_KYCVerification() public view {
        assertTrue(identityRegistry.isVerified(investor1));
        assertTrue(identityRegistry.isVerified(investor2));
    }
    
    function test_InvestorBuyTokens() public {
        uint256 buyAmount = 100 * 1e18;
        uint256 cost = buyAmount * TOKEN_PRICE / 1e18;
        
        vm.startPrank(investor1);
        krwt.approve(address(propertyToken), cost);
        propertyToken.buy(buyAmount);
        vm.stopPrank();
        
        assertEq(propertyToken.balanceOf(investor1), buyAmount);
    }
    
    function test_DividendDistribution() public {
        // 1. 투자자들 토큰 구매
        vm.startPrank(investor1);
        krwt.approve(address(propertyToken), 100_000_000 * 1e18);
        propertyToken.buy(100 * 1e18);
        vm.stopPrank();
        
        vm.startPrank(investor2);
        krwt.approve(address(propertyToken), 50_000_000 * 1e18);
        propertyToken.buy(50 * 1e18);
        vm.stopPrank();
        
        // 2. 스냅샷 생성
        vm.prank(admin);
        uint256 snapshotId = propertyToken.snapshot();
        
        // 3. 배당금 입금
        uint256 dividendAmount = 15_000_000 * 1e18; // 1500만원
        vm.startPrank(admin);
        krwt.approve(address(dividendDistributor), dividendAmount);
        dividendDistributor.createDividend(snapshotId, dividendAmount);
        vm.stopPrank();
        
        // 4. 배당 청구
        uint256 before1 = krwt.balanceOf(investor1);
        uint256 before2 = krwt.balanceOf(investor2);
        
        vm.prank(investor1);
        dividendDistributor.claimDividend(1);
        
        vm.prank(investor2);
        dividendDistributor.claimDividend(1);
        
        // 5. 검증
        assertGt(krwt.balanceOf(investor1), before1);
        assertGt(krwt.balanceOf(investor2), before2);
    }
    
    // ============================================
    //              FULL FLOW (데모용!)
    // ============================================
    
    function test_FullFlow_Demo() public {
        console.log("=== NovaTerra Demo ===");
        console.log("");
        
        // 1. 투자자들 토큰 구매
        vm.startPrank(investor1);
        krwt.approve(address(propertyToken), 100_000_000 * 1e18);
        propertyToken.buy(100 * 1e18);
        vm.stopPrank();
        console.log("Investor1 bought: 100 tokens (100M KRW)");
        
        vm.startPrank(investor2);
        krwt.approve(address(propertyToken), 50_000_000 * 1e18);
        propertyToken.buy(50 * 1e18);
        vm.stopPrank();
        console.log("Investor2 bought: 50 tokens (50M KRW)");
        
        // 잔액 확인
        console.log("");
        console.log("=== Token Balances ===");
        console.log("Investor1:", propertyToken.balanceOf(investor1) / 1e18, "tokens");
        console.log("Investor2:", propertyToken.balanceOf(investor2) / 1e18, "tokens");
        
        // 2. 스냅샷 생성 (배당 기준일)
        vm.prank(admin);
        uint256 snapshotId = propertyToken.snapshot();
        console.log("");
        console.log("Snapshot created, ID:", snapshotId);
        
        // 3. 배당금 입금 (월 임대수익 1500만원)
        uint256 dividendAmount = 15_000_000 * 1e18;
        vm.startPrank(admin);
        krwt.approve(address(dividendDistributor), dividendAmount);
        dividendDistributor.createDividend(snapshotId, dividendAmount);
        vm.stopPrank();
        console.log("Dividend deposited: 15,000,000 KRWT");
        
        // 4. 배당 가능 금액 조회
        uint256 claimable1 = dividendDistributor.getClaimableDividend(1, investor1);
        uint256 claimable2 = dividendDistributor.getClaimableDividend(1, investor2);
        
        console.log("");
        console.log("=== Claimable Dividends ===");
        console.log("Investor1:", claimable1 / 1e18, "KRWT");
        console.log("Investor2:", claimable2 / 1e18, "KRWT");
        
        // 5. 배당 청구
        vm.prank(investor1);
        dividendDistributor.claimDividend(1);
        console.log("");
        console.log("Investor1 claimed dividend!");
        
        vm.prank(investor2);
        dividendDistributor.claimDividend(1);
        console.log("Investor2 claimed dividend!");
        
        console.log("");
        console.log("=== Demo Complete ===");
    }
}
