package org.landmark.domain.properties.service;

import org.landmark.domain.properties.dto.PropertyCreateRequest;
import org.springframework.web.multipart.MultipartFile;

public interface PropertyService {
  String createProperty(PropertyCreateRequest request, MultipartFile coverImage);
}
