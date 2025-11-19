package org.landmark.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
  private final AmazonS3 amazonS3;

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

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

    ObjectMetadata objectMetadata = new ObjectMetadata();
    objectMetadata.setContentLength(file.getSize());
    objectMetadata.setContentType(file.getContentType());

    try (InputStream inputStream = file.getInputStream()) {
      amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata)
          .withCannedAcl(CannedAccessControlList.PublicRead));
    } catch (IOException e) {
      log.error("S3 업로드 실패: {}", e.getMessage());
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    return amazonS3.getUrl(bucket, fileName).toString();
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
