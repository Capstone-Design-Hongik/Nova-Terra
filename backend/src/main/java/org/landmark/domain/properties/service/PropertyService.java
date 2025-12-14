package org.landmark.domain.properties.service;

import org.landmark.domain.properties.dto.PropertyCreateRequest;
import org.landmark.domain.properties.dto.PropertyResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PropertyService {
  String createProperty(PropertyCreateRequest request, MultipartFile coverImage);

  List<PropertyResponse> getAllProperties();
}
