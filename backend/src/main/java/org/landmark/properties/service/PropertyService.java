package org.landmark.properties.service;

import org.landmark.properties.dto.PropertyCreateRequest;
import org.springframework.web.multipart.MultipartFile;

public interface PropertyService {
  String createProperty(PropertyCreateRequest request, MultipartFile coverImage);
}
