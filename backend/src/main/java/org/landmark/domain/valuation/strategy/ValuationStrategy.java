package org.landmark.domain.valuation.strategy;

import java.math.BigDecimal;

/* 부동산 가치 평가 전략 인터페이스 */
public interface ValuationStrategy {

    BigDecimal evaluateValue(String address, BigDecimal exclusiveAreaSqm);
}
