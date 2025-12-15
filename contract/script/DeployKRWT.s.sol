// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/KRWT.sol";

/**
 * @title DeployKRWT
 * @notice KRWT (Korean Won Token) 배포 스크립트
 * @dev Nova-Terra 시스템의 결제/배당 토큰
 */
contract DeployKRWT is Script {

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("====================================");
        console.log("KRWT Deployment Script");
        console.log("====================================");
        console.log("Deployer:", deployer);
        console.log("====================================\n");

        vm.startBroadcast(deployerPrivateKey);

        // KRWT 배포
        console.log("Deploying KRWT...");
        KRWT krwt = new KRWT();

        console.log("KRWT deployed to:", address(krwt));
        console.log("Initial supply:", krwt.totalSupply() / 10**krwt.decimals(), "KRWT");
        console.log("Owner:", krwt.owner());

        vm.stopBroadcast();

        // 배포 결과 출력
        console.log("\n====================================");
        console.log("Deployment Summary");
        console.log("====================================");
        console.log("KRWT Address:", address(krwt));
        console.log("Total Supply:", krwt.totalSupply() / 10**krwt.decimals(), "KRWT");
        console.log("Decimals:", krwt.decimals());
        console.log("====================================");
        console.log("\nAdd this to your .env file:");
        console.log("KRWT_ADDRESS=", address(krwt));
        console.log("====================================\n");
    }
}
