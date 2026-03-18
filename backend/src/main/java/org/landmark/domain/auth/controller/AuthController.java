package org.landmark.domain.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.auth.dto.TokenRefreshRequest;
import org.landmark.domain.auth.dto.TokenResponse;
import org.landmark.domain.auth.dto.UserInfoResponse;
import org.landmark.domain.auth.service.AuthService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "토큰 재발급", description = "Refresh Token으로 새로운 Access Token을 발급합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@RequestBody TokenRefreshRequest request) {
        TokenResponse tokenResponse = authService.refreshToken(request.refreshToken());
        return ResponseEntity.ok(ApiResponse.ok(200,"토큰 재발급 성공", tokenResponse));
    }

    @Operation(summary = "내 정보 조회", description = "현재 로그인된 사용자의 정보를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getMyInfo(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        var userInfo = authService.getUserInfo(userId);
        return ResponseEntity.ok(ApiResponse.ok(200,"사용자 정보 조회 성공", userInfo));
    }
}
