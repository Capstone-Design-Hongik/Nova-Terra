// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.20;

  import "forge-std/Script.sol";
  import "../src/SecurityToken.sol";
  import "../src/GovernanceToken.sol";
  import "../src/Governance.sol";

  contract DeployScript is Script {
      function run() external {
          // .env에서 PRIVATE_KEY 읽어오기
          uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

          vm.startBroadcast(deployerPrivateKey);

          // 1. SecurityToken 배포
          SecurityToken sto = new SecurityToken(
              "Security Token",    // 이름
              "STO",              // 심볼
              18,                 // decimals
              1000000             // 초기 공급량 (1,000,000 토큰)
          );

          // 2. GovernanceToken 배포 (STO 주소 전달)
          GovernanceToken govToken = new GovernanceToken(address(sto));

          // 3. Governance 배포 (GovernanceToken 주소 전달)
          Governance governance = new Governance(address(govToken));

          vm.stopBroadcast();

          // 배포된 주소 출력
          console.log("SecurityToken deployed to:", address(sto));
          console.log("GovernanceToken deployed to:", address(govToken));
          console.log("Governance deployed to:", address(governance));
      }
  }