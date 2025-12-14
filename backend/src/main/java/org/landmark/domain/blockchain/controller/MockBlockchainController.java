package org.landmark.domain.blockchain.controller;

import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.blockchain.dto.DistributeRentalIncomeRequest;
import org.landmark.domain.blockchain.dto.DistributeRentalIncomeResponse;
import org.landmark.domain.blockchain.dto.MintRequest;
import org.landmark.domain.blockchain.dto.MintResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/* Mock 블록체인 서버 (테스트용) */
@Slf4j
@RestController
@RequestMapping("/mock-blockchain")
public class MockBlockchainController {

    @PostMapping("/api/tokens/mint")
    public MintResponse mockMint(@RequestBody MintRequest request) {
        log.info("===== Mock 블록체인 서버 =====");
        log.info("토큰 발행 요청 수신:");
        log.info("  - Property ID: {}", request.propertyId());
        log.info("  - Total Supply: {}", request.totalSupply());
        log.info("  - Valuation Price: {}원", request.valuationPrice());

        // 가짜 트랜잭션 해시 생성 (실제로는 TS 서버에서 블록체인 트랜잭션 후 반환)
        String mockTxHash = "0x" + UUID.randomUUID().toString().replace("-", "");

        log.info("Mock Transaction Hash 생성: {}", mockTxHash);
        log.info("==============================");

        return new MintResponse(
                true,
                mockTxHash,
                "Mock: 토큰 발행이 성공적으로 완료되었습니다."
        );
    }

    @PostMapping("/api/rental/distribute")
    public DistributeRentalIncomeResponse mockDistributeRentalIncome(@RequestBody DistributeRentalIncomeRequest request) {
        log.info("===== Mock 블록체인 서버 =====");
        log.info("임대 수익 분배 요청 수신:");
        log.info("  - Property ID: {}", request.propertyId());
        log.info("  - KRWT Amount: {}", request.krwtAmount());

        // 가짜 트랜잭션 해시 생성
        String mockTxHash = "0x" + UUID.randomUUID().toString().replace("-", "");

        log.info("Mock Transaction Hash 생성: {}", mockTxHash);
        log.info("KRWT 분배 완료: STO 컨트랙트로 {} KRWT 전송", request.krwtAmount());
        log.info("==============================");

        return new DistributeRentalIncomeResponse(
                true,
                mockTxHash,
                "Mock: 임대 수익 분배가 성공적으로 완료되었습니다."
        );
    }
}
