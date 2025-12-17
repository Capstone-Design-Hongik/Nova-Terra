package org.landmark.domain.portfolio.service;

import org.landmark.domain.portfolio.dto.PortfolioResponse;

public interface PortfolioService {

    PortfolioResponse getUserPortfolio(String userId);
}
