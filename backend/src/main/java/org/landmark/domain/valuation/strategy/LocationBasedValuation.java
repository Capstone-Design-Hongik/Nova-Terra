package org.landmark.domain.valuation.strategy;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class LocationBasedValuation implements ValuationStrategy {

    // 지역별 평당 단가 (원/평)
    private static final Map<String, BigDecimal> PRICE_PER_PYEONG = new HashMap<>();

    static {
        // 서울 주요 지역별 평당 단가 (단위: 만원)
        PRICE_PER_PYEONG.put("강남", new BigDecimal("8000"));  // 강남구
        PRICE_PER_PYEONG.put("서초", new BigDecimal("7500"));  // 서초구
        PRICE_PER_PYEONG.put("송파", new BigDecimal("6500"));  // 송파구
        PRICE_PER_PYEONG.put("강동", new BigDecimal("5500"));  // 강동구
        PRICE_PER_PYEONG.put("성수", new BigDecimal("6000"));  // 성동구 성수
        PRICE_PER_PYEONG.put("성동", new BigDecimal("6000"));  // 성동구
        PRICE_PER_PYEONG.put("용산", new BigDecimal("7000"));  // 용산구
        PRICE_PER_PYEONG.put("마포", new BigDecimal("6200"));  // 마포구
        PRICE_PER_PYEONG.put("영등포", new BigDecimal("5800")); // 영등포구
        PRICE_PER_PYEONG.put("기본", new BigDecimal("5000"));  // 기타 지역 기본값
    }

    // 1평 = 3.3058 제곱미터
    private static final BigDecimal SQM_TO_PYEONG = new BigDecimal("3.3058");

    @Override
    public BigDecimal evaluateValue(String address, BigDecimal exclusiveAreaSqm) {
        if (address == null || address.isBlank()) {
            log.warn("주소 정보가 없습니다. 기본 단가를 적용합니다.");
            return calculateValue("기본", exclusiveAreaSqm);
        }

        // 주소에서 지역 키워드 추출
        String location = extractLocation(address);
        log.info("부동산 주소: {}, 추출된 지역: {}", address, location);

        return calculateValue(location, exclusiveAreaSqm);
    }

    private String extractLocation(String address) {
        for (String key : PRICE_PER_PYEONG.keySet()) {
            if (address.contains(key)) {
                return key;
            }
        }
        return "기본";
    }

    /* 가치 계산: 제곱미터 -> 평수 변환 -> 평당 단가 적용 */
    private BigDecimal calculateValue(String location, BigDecimal exclusiveAreaSqm) {
        // 제곱미터를 평수로 변환 후 평당 단가로
        BigDecimal pyeong = exclusiveAreaSqm.divide(SQM_TO_PYEONG, 2, RoundingMode.HALF_UP);

        BigDecimal pricePerPyeong = PRICE_PER_PYEONG.getOrDefault(location, PRICE_PER_PYEONG.get("기본"));

        // 총 가치 = 평수 * 평당 단가
        BigDecimal totalValueInManwon = pyeong.multiply(pricePerPyeong);

        BigDecimal totalValue = totalValueInManwon.multiply(new BigDecimal("10000"));   // 만원 -> 원

        log.info("가치 평가 완료 - 지역: {}, 면적: {}㎡ ({}평), 평당단가: {}만원, 총가치: {}원",
                location, exclusiveAreaSqm, pyeong, pricePerPyeong, totalValue);

        return totalValue.setScale(0, RoundingMode.HALF_UP);
    }
}
