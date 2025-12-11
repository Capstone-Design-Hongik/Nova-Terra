package org.landmark.domain.issuance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.dto.ApiResponse;
import org.landmark.domain.issuance.dto.IssuanceRequest;
import org.landmark.domain.issuance.dto.IssuanceResponse;
import org.landmark.domain.issuance.service.IssuanceService;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/issuance")
@RequiredArgsConstructor
@Tag(name = "Token Issuance", description = "부동산 토큰 발행 API")
public class IssuanceController {

    private final IssuanceService issuanceService;
    private final PropertyRepository propertyRepository;

    /* 부동산 토큰 발행
     * POST /api/v1/issuance/mint */
    @Operation(summary = "부동산 토큰 발행", description = "부동산 가치를 평가하고 블록체인에 토큰을 발행합니다.")
    @PostMapping("/mint")
    public ApiResponse<IssuanceResponse> mintPropertyToken(
            @Valid @RequestBody IssuanceRequest request
    ) {
        log.info("토큰 발행 요청 - propertyId: {}", request.propertyId());

        String txHash = issuanceService.issuePropertyToken(request.propertyId());

        // 발행 후 최신 정보 조회
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow();

        IssuanceResponse response = new IssuanceResponse(
                property.getId(),
                txHash,
                property.getTotalValuation(),
                property.getTotalTokens()
        );

        return ApiResponse.created("토큰 발행이 완료되었습니다.", response);
    }
}
