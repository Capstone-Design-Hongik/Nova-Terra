package org.landmark.global.dto;

import org.springframework.http.HttpStatus;

public class ApiResponse<T> {
  private final int code; // HTTP 상태 코드
  private final String message; // 응답 메시지
  private final T data; // 실제 응답 데이터

  private ApiResponse(int code, String message, T data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  public static <T> ApiResponse<T> ok(int code, String message, T data) {
    return new ApiResponse<>(code, message, data);
  }

  public static <T> ApiResponse<T> ok(int code, String message) {
    return new ApiResponse<>(code, message, null);
  }

  // 200 OK
  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(HttpStatus.OK.value(), "요청에 성공했습니다.", data);
  }

  // 201 Created
  public static <T> ApiResponse<T> created(T data) {
    return new ApiResponse<>(HttpStatus.CREATED.value(), "✅ 리소스가 성공적으로 생성되었습니다.", data);
  }

  public static <T> ApiResponse<T> created(String message, T data) {
    return new ApiResponse<>(HttpStatus.CREATED.value(), message, data);
  }

  public static <T> ApiResponse<T> error(int code, String message) {
    return new ApiResponse<>(code, message, null);
  }

  public int getCode() { return code; }
  public String getMessage() { return message; }
  public T getData() { return data; }
}
