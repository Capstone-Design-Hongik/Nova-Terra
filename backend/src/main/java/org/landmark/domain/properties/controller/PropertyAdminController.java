package org.landmark.domain.properties.controller;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.landmark.global.dto.ApiResponse;
import org.landmark.domain.properties.dto.PropertyCreateRequest;
import org.landmark.domain.properties.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/properties")
@RequiredArgsConstructor
public class PropertyAdminController {
  private final PropertyService propertyService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ApiResponse<Map<String, String>>> createProperty(
      @RequestPart(value = "data") PropertyCreateRequest request,
      @RequestPart(value = "image", required = false) MultipartFile image
  ) {
    String propertyId = propertyService.createProperty(request, image);

    Map<String, String> responseData = Map.of("propertyId", propertyId);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.created("부동산 상품이 등록되었습니다.", responseData));
  }
}
