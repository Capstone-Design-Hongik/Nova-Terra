// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.20;

  import {Script, console} from "forge-std/Script.sol";
  import {SecurityToken} from "../src/SecurityToken.sol";
  import {GovernanceToken} from "../src/GovernanceToken.sol";
  import {Governance} from "../src/Governance.sol";

  contract DeployScript is Script {
      function run() external {
          // .env에서 PRIVATE_KEY 읽어오기
          uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

          // 배포 시작 (이 안에 있는 모든 트랜잭션이 실제로 전송됨)
          vm.startBroadcast(deployerPrivateKey);

          // 1단계: SecurityToken (STO) 배포
          console.log("Deploying SecurityToken...");
          SecurityToken sto = new SecurityToken( //new가 컨트랙트 배포 명령어임 
              "Nova Terra STO",  // 토큰 이름
              "NTSTO",                       // 토큰 심볼
              18,                           // decimals
              1000000                       // 초기 공급량: 1,000,000 토큰
          );
          console.log("SecurityToken deployed to:", address(sto));

          // 2단계: GovernanceToken 배포 (STO 주소 필요)
          console.log("Deploying GovernanceToken...");
          GovernanceToken govToken = new GovernanceToken(address(sto));
          console.log("GovernanceToken deployed to:", address(govToken));

          // 3단계: Governance (DAO) 배포 (GovernanceToken 주소 필요)
          console.log("Deploying Governance...");
          Governance governance = new Governance(address(govToken));
          console.log("Governance deployed to:", address(governance));

          // 배포 종료
          vm.stopBroadcast();

          // 최종 요약 출력
          console.log("\n=== Deployment Summary ===");
          console.log("SecurityToken:", address(sto));
          console.log("GovernanceToken:", address(govToken));
          console.log("Governance:", address(governance));
          console.log("Deployer:", vm.addr(deployerPrivateKey));
      }
  }
