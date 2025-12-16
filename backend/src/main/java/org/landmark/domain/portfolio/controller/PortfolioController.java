package org.landmark.domain.portfolio.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.portfolio.dto.PortfolioResponse;
import org.landmark.domain.portfolio.service.PortfolioService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/portfolio")
@RequiredArgsConstructor
@Tag(name = "Portfolio", description = "포트폴리오(내 자산) API")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @Operation(summary = "내 포트폴리오 조회", description = "사용자가 보유한 부동산 자산 목록을 조회합니다.")
    @GetMapping("/{userId}")
    public ApiResponse<PortfolioResponse> getUserPortfolio(@PathVariable String userId) {
        PortfolioResponse portfolio = portfolioService.getUserPortfolio(userId);
        return ApiResponse.ok(200, "포트폴리오 조회 성공", portfolio);
    }
}
