package org.landmark.properties.service;

import org.landmark.properties.dto.PropertyCreateRequest;
import org.springframework.web.multipart.MultipartFile;

public interface PropertyService {
  Long createProperty(PropertyCreateRequest request, MultipartFile coverImage);
}
