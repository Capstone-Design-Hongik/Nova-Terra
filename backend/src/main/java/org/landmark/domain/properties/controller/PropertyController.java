package org.landmark.domain.properties.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.landmark.domain.properties.dto.PropertyResponse;
import org.landmark.domain.properties.service.PropertyService;
import org.landmark.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
@Tag(name = "Property", description = "부동산 상품 API")
public class PropertyController {
    private final PropertyService propertyService;

    @Operation(summary = "부동산 목록 조회", description = "등록된 모든 부동산 상품 목록을 조회합니다.")
    @GetMapping
    public ApiResponse<List<PropertyResponse>> getAllProperties() {
        List<PropertyResponse> properties = propertyService.getAllProperties();
        return ApiResponse.ok(200, "부동산 목록 조회 성공", properties);
    }

    @Operation(summary = "부동산 상세 조회", description = "부동산 ID로 특정 부동산의 상세 정보를 조회합니다.")
    @GetMapping("/{propertyId}")
    public ApiResponse<PropertyResponse> getPropertyById(@PathVariable String propertyId) {
        PropertyResponse property = propertyService.getPropertyById(propertyId);
        return ApiResponse.ok(200, "부동산 조회 성공", property);
    }
}
