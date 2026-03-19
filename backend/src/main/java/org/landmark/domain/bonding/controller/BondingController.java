package org.landmark.domain.bonding.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.bonding.dto.CreditStartRequest;
import org.landmark.domain.bonding.dto.CreditStatusResponse;
import org.landmark.domain.bonding.dto.KycValidateRequest;
import org.landmark.domain.bonding.dto.VerificationResponse;
import org.landmark.domain.bonding.service.BondingService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Bonding", description = "KYC / Credit 검증 API")
@RestController
@RequestMapping("/api/v1/bonding")
@RequiredArgsConstructor
public class BondingController {

    private final BondingService bondingService;

    @Operation(summary = "KYC 검증", description = "Stripe Identity 세션을 검증하고 KYC 해시를 저장합니다.")
    @PostMapping("/kyc/validate")
    public ResponseEntity<ApiResponse<VerificationResponse>> validateKyc(
            Authentication authentication,
            @Valid @RequestBody KycValidateRequest request
    ) {
        String userId = (String) authentication.getPrincipal();
        String idHash = bondingService.validateKyc(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(200, "KYC 검증 성공", VerificationResponse.pendingChain(idHash)));
    }

    @Operation(summary = "신용 검증 시작", description = "Plaid Link 토큰을 발급합니다.")
    @PostMapping("/credit/start")
    public ResponseEntity<ApiResponse<String>> startCredit(
            Authentication authentication,
            @Valid @RequestBody CreditStartRequest request
    ) {
        String userId = (String) authentication.getPrincipal();
        String linkToken = bondingService.startCredit(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(200, "Link 토큰 발급 성공", linkToken));
    }

    @Operation(summary = "신용 검증", description = "Plaid 리포트를 기반으로 신용 점수를 계산합니다.")
    @PostMapping("/credit/validate")
    public ResponseEntity<ApiResponse<VerificationResponse>> validateCredit(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        VerificationResponse response = bondingService.validateCredit(userId);
        String message = "pending_report".equals(response.status()) ? "리포트 준비 중" : "신용 검증 성공";
        return ResponseEntity.ok(ApiResponse.ok(200, message, response));
    }

    @Operation(summary = "신용 상태 조회", description = "가장 최근 신용 점수 상태를 조회합니다.")
    @GetMapping("/credit/status")
    public ResponseEntity<ApiResponse<CreditStatusResponse>> creditStatus(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        CreditStatusResponse response = bondingService.latestCredit(userId);
        return ResponseEntity.ok(ApiResponse.ok(200, "신용 상태 조회 성공", response));
    }
}
