package org.landmark.domain.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.portfolio.domain.UserHolding;
import org.landmark.domain.portfolio.dto.PortfolioResponse;
import org.landmark.domain.portfolio.dto.PropertyHoldingResponse;
import org.landmark.domain.portfolio.repository.UserHoldingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioServiceImpl implements PortfolioService {

    // TODO: 블록체인 설정 완료 후 BlockchainWalletService로 변경
    private final UserHoldingRepository userHoldingRepository;

    @Override
    public PortfolioResponse getUserPortfolio(String userId) {
        log.info("사용자 포트폴리오 조회 - userId: {}", userId);

        // DB에서 사용자가 보유한 부동산 목록 조회 (Property 정보 함께 fetch)
        List<UserHolding> holdings = userHoldingRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        if (holdings.isEmpty()) {
            log.info("사용자 보유 자산 없음 - userId: {}", userId);
            return PortfolioResponse.of(userId, List.of());
        }

        List<PropertyHoldingResponse> propertyHoldings = holdings.stream()
            .map(PropertyHoldingResponse::from)
            .collect(Collectors.toList());

        log.info("사용자 포트폴리오 조회 완료 - userId: {}, 보유 부동산 수: {}", userId, propertyHoldings.size());
        return PortfolioResponse.of(userId, propertyHoldings);
    }
}
