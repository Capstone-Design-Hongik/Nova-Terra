package org.landmark.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
  private final S3Client s3Client;

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  @Value("${cloud.aws.region.static}")
  private String region;

  /* 이미지 여러장 업로드 */
  public List<String> uploadImages(List<MultipartFile> multipartFiles) {
    List<String> fileNameList = new ArrayList<>();

    if (multipartFiles == null || multipartFiles.isEmpty()) {
      return fileNameList;
    }

    for (MultipartFile file : multipartFiles) {
      if (file.isEmpty()) continue; // 빈 파일 건너뛰기
      String fileName = uploadImage(file);
      fileNameList.add(fileName);
    }

    return fileNameList;
  }

  /* 이미지 한장 업로드 */
  public String uploadImage(MultipartFile file) {
    // 파일명 중복 방지를 위한 UUID 생성
    String originalFileName = file.getOriginalFilename();
    String fileName = createFileName(originalFileName);

    try {
      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(bucket)
          .key(fileName)
          .contentType(file.getContentType())
          .contentLength(file.getSize())
          .build();

      s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
    } catch (IOException e) {
      log.error("S3 업로드 실패: {}", e.getMessage());
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    // S3 URL 생성: https://{bucket}.s3.{region}.amazonaws.com/{key}
    return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, fileName);
  }

  private String createFileName(String originalFileName) {
    return UUID.randomUUID().toString().concat(getFileExtension(originalFileName));
  }

  // 파일 확장자 추출
  private String getFileExtension(String fileName) {
    try {
      return fileName.substring(fileName.lastIndexOf("."));
    } catch (StringIndexOutOfBoundsException e) {
      throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE); // 잘못된 형식의 파일
    }
  }
}
