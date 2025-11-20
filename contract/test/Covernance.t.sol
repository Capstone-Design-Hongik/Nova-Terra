// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Governance} from "../src/Governance.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {SecurityToken} from "../src/SecurityToken.sol";

contract GovernanceTest is Test {
    // 컨트랙트 인스턴스
    SecurityToken public sto;
    GovernanceToken public govToken;
    Governance public governance;

    // 테스트 사용자
    address public user1;
    address public user2;

    function setUp() public {
        // Owner 설정
        user1 = address(this);

        // 테스트 사용자 주소 생성
        user2 = makeAddr("user2");


        // 컨트랙트 배포
        sto = new SecurityToken("Security Token", "STO", 18, 1000000);
        govToken = new GovernanceToken(address(sto));
        governance = new Governance(address(govToken));

        console.log("=== Setup Complete ===");
        console.log("STO:", address(sto));
        console.log("GovernanceToken:", address(govToken));
        console.log("Governance:", address(governance));
    }

    // ========================================
    // 테스트 1: 정상 플로우
    // ========================================
    function test_FullFlow_Success() public {
        console.log("\n=== TEST 1: Full Flow Success ===");

        // 1. STO 민팅 확인 (setUp에서 자동)
        console.log("Step 1: Check STO minted to owner");
        assertEq(sto.balanceOf(user1), 1000000 * 10**18);

        // // 2. user1을 화이트리스트에 추가
        // console.log("Step 2: Add user1 to whitelist");
        // sto.addToWhitelist(user1);
        // assertTrue(sto.isWhitelisted(user1));

        // // 3. user1에게 STO 전송
        // console.log("Step 3: Transfer STO to user1");
        // sto.transfer(user1, 100 * 10**18);
        // assertEq(sto.balanceOf(user1), 100 * 10**18);

        console.log("skip STO logic");

        // 4. DAO (GovernanceToken) 민팅
        console.log("Step 4: Mint DAO tokens");
        govToken.mintGovernanceTokens(user1);
        assertEq(govToken.balanceOf(user1), sto.balanceOf(user1) );

        // 5. Self-delegate
        console.log("Step 5: Self-delegate");
        uint256 votesBefore = govToken.getVotes(user1);
        console.log("  Votes before delegate:", votesBefore);
        assertEq(votesBefore, 0, "Votes should be 0 before delegate");

        //vm.prank(user1); -> 다음 한줄만 user1이 실행하는척. (다중 사용자 테스트에 유리)
        govToken.delegate(user1);
        

        uint256 votesAfter = govToken.getVotes(user1);
        console.log("  Votes after delegate:", votesAfter);
        assertEq(votesAfter, govToken.balanceOf(user1), "Votes should equal balance after delegate");

        // 6. 제안 생성
        console.log("Step 6: Create proposal");
        uint256 proposalId = governance.createProposal("First proposal: Increase supply");
        vm.roll(block.number + 1);

        assertEq(proposalId, 0);
        assertEq(governance.proposalCount(), 1);
        console.log("  Proposal ID:", proposalId);

        // 7. 투표 성공
        console.log("Step 7: Vote on proposal");
        governance.vote(proposalId, true);

        assertTrue(governance.hasVoted(proposalId, user1));

        // 8. 결과 확인
        (
            string memory desc,
            uint256 forVotes,
            uint256 againstVotes,
            ,
            ,
        ) = governance.getProposal(proposalId);

        console.log("  Description:", desc);
        console.log("  For votes:", forVotes);
        console.log("  Against votes:", againstVotes);

        assertEq(forVotes, govToken.getVotes(user1) );
        assertEq(againstVotes, 0);

        console.log("=== TEST 1 PASSED ===\n");


        // ========================================
        // 테스트 2: 위임 없이 투표 실패
        // ========================================

         // 5. delegate 호출 X
        console.log("Step 5: SKIP delegate");
        uint256 votes = govToken.getVotes(user2);
        console.log("  user2 votes:", votes);
        assertEq(votes, 0, "Votes should be 0 without delegate");

        // 6. 제안 생성 시도 → 실패
        console.log("Step 6: Try to create proposal (should fail)");
        vm.prank(user2);
        vm.expectRevert("No voting power");
        governance.createProposal("Should fail");

        assertEq(governance.proposalCount(), 1);
        console.log("  Correctly reverted!");

        console.log("=== TEST 2 PASSED ===\n");

        // ========================================
        // 테스트 3: 타인에게 위임 후 투표권 이동
        // ========================================

        // 3. user1이 user2에게 위임
        console.log("Step 3: user1 delegates to user2");
        govToken.delegate(user2);
        
        // 5. 투표권 확인
        console.log("Step 5: Check voting power");
        uint256 user1Votes = govToken.getVotes(user1);
        uint256 user2Votes = govToken.getVotes(user2);

        console.log("  user1 votes:", user1Votes);
        console.log("  user2 votes:", user2Votes);

        assertEq(user1Votes, 0, "user1 should have 0 votes");
        assertEq(user2Votes, govToken.balanceOf(user1), "user2 should have votes of user1's govToken balances ");

        // 6. user2가 제안 생성
        console.log("Step 6: user2 creates proposal");
        vm.prank(user2);
        uint256 proposalId2 = governance.createProposal("Proposal by user2");
        vm.roll(block.number + 1);
        console.log("  Proposal ID:", proposalId2);

        // 7. user1이 투표 시도 → 실패
        console.log("Step 7: user1 tries to vote (should fail)");
        vm.prank(user1);
        vm.expectRevert("No voting power at snapshot");
        governance.vote(proposalId2, true);
        console.log("  Correctly reverted!");

        // 8. user2가 투표 → 성공
        console.log("Step 8: user2 votes (should succeed)");
        vm.prank(user2);
        governance.vote(proposalId2, true);

        // 9. 결과 확인
        console.log("Step 9: Verify results");
        assertTrue(governance.hasVoted(proposalId2, user2));
        assertFalse(governance.hasVoted(proposalId2, user1));

        (
            ,
            uint256 forVotes2,
            ,
            ,
            ,
        ) = governance.getProposal(proposalId2);

        console.log("  For votes:", forVotes2);
        assertEq(forVotes2, govToken.getVotes(user2), "Should be mm");

        console.log("=== TEST 3 PASSED ===\n");
    }

  
}
