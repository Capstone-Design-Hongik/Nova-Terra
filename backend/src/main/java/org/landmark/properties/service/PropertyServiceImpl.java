package org.landmark.properties.service;

import lombok.RequiredArgsConstructor;
import org.landmark.global.service.S3Service;
import org.landmark.properties.domain.Property;
import org.landmark.properties.dto.PropertyCreateRequest;
import org.landmark.properties.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
  private final PropertyRepository propertyRepository;
  private final S3Service s3Service;

  @Transactional
  public Long createProperty(PropertyCreateRequest request, MultipartFile coverImage) {

    String coverImageUrl = null;
    if (coverImage != null && !coverImage.isEmpty()) {
      coverImageUrl = s3Service.uploadImage(coverImage);
    }

    Property property = request.toEntity(coverImageUrl);

    propertyRepository.save(property);

    return 1L; // 임시
  }
}
