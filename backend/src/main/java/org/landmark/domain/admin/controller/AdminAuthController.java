package org.landmark.domain.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.admin.dto.AdminLoginRequest;
import org.landmark.domain.admin.service.AdminService;
import org.landmark.domain.auth.dto.TokenResponse;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Auth", description = "관리자 인증 API")
public class AdminAuthController {

    private final AdminService adminService;

    @Operation(summary = "관리자 로그인", description = "아이디/비밀번호로 관리자 로그인합니다.")
    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        TokenResponse token = adminService.login(request.username(), request.password());
        return ApiResponse.ok(200, "관리자 로그인 성공", token);
    }
}
