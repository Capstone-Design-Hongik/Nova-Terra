package org.landmark.domain.blockchain.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.blockchain.dto.MintRequest;
import org.landmark.domain.blockchain.dto.MintResponse;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * 블록체인 서버(TS)와 통신하는 클라이언트
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BlockchainClient {

    private final RestClient blockchainRestClient;

    public MintResponse mintToken(MintRequest request) {
        log.info("블록체인 서버로 토큰 발행 요청 - propertyId: {}, totalSupply: {}, valuationPrice: {}",
                request.propertyId(), request.totalSupply(), request.valuationPrice());

        try {
            MintResponse response = blockchainRestClient.post()
                    .uri("/api/tokens/mint")
                    .body(request)
                    .retrieve()
                    .body(MintResponse.class);

            if (response == null) {
                log.error("블록체인 서버로부터 응답이 없습니다.");
                throw new BusinessException(ErrorCode.BLOCKCHAIN_SERVER_ERROR);
            }

            if (!response.success()) {
                log.error("토큰 발행 실패 - message: {}", response.message());
                throw new BusinessException(ErrorCode.BLOCKCHAIN_SERVER_ERROR);
            }

            log.info("토큰 발행 성공 - txHash: {}", response.txHash());
            return response;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("블록체인 서버 통신 중 예외 발생", e);
            throw new BusinessException(ErrorCode.BLOCKCHAIN_SERVER_ERROR);
        }
    }

}
