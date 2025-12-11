package org.landmark.domain.issuance.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.blockchain.client.BlockchainClient;
import org.landmark.domain.blockchain.dto.MintRequest;
import org.landmark.domain.blockchain.dto.MintResponse;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.valuation.strategy.ValuationStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class IssuanceService {

    private final PropertyRepository propertyRepository;
    private final ValuationStrategy valuationStrategy;
    private final BlockchainClient blockchainClient;

    /*  부동산 토큰 발행 프로세스 */
    @Transactional
    public String issuePropertyToken(String propertyId) {
        log.info("부동산 토큰 발행 시작 - propertyId: {}", propertyId);

        // 부동산 조회
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        if (property.getMintTxHash() != null && !property.getMintTxHash().isBlank()) {
            log.warn("이미 토큰이 발행된 부동산입니다 - propertyId: {}, txHash: {}", propertyId, property.getMintTxHash());
            throw new BusinessException(ErrorCode.ALREADY_MINTED);
        }

        BigDecimal valuationPrice = evaluateProperty(property);
        log.info("부동산 가치 평가 완료 - propertyId: {}, valuationPrice: {}원", propertyId, valuationPrice);

        // 발행량 산정 (원화 1:1 스테이블코인)
        Long totalSupply = calculateTotalSupply(valuationPrice);
        log.info("토큰 발행량 산정 완료 - propertyId: {}, totalSupply: {}", propertyId, totalSupply);

        property.updateValuationAndTokens(valuationPrice, totalSupply);

        // 블록체인 서버로 발행 요청
        MintRequest mintRequest = new MintRequest(propertyId, totalSupply, valuationPrice);
        MintResponse mintResponse = blockchainClient.mintToken(mintRequest);

        String txHash = mintResponse.txHash();
        property.updateMintTxHash(txHash);

        log.info("부동산 토큰 발행 완료 - propertyId: {}, txHash: {}", propertyId, txHash);

        return txHash;
    }

    /* 부동산 가치 평가 */
    private BigDecimal evaluateProperty(Property property) {
        try {
            return valuationStrategy.evaluateValue(
                    property.getAddress(),
                    property.getExclusiveAreaSqm()
            );
        } catch (Exception e) {
            log.error("부동산 가치 평가 실패 - propertyId: {}", property.getId(), e);
            throw new BusinessException(ErrorCode.VALUATION_FAILED);
        }
    }

    /* 원화 1:1 스테이블코인 기준으로 토큰 수량 계산 */
    private Long calculateTotalSupply(BigDecimal valuationPrice) {
        return valuationPrice.setScale(0, RoundingMode.HALF_UP).longValue();
    }
}
