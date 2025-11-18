package org.landmark.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public enum ErrorCode {

  // 400 Bad Request
  INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "유효하지 않은 입력 값입니다."),
  INVALID_METHOD(HttpStatus.BAD_REQUEST, "지원하지 않는 HTTP 메서드입니다."),

  // 404 Not Found
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
  PROPERTY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 부동산 상품입니다."),
  PROPOSAL_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 제안입니다."),

  // 500 Internal Server Error
  INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");

  private final HttpStatus status;
  private final String message;

  public int getCode() {
    return this.status.value();
  }
}