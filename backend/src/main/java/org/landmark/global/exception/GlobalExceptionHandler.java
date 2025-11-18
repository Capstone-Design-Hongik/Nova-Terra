package org.landmark.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.landmark.global.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  /* 서비스 로직에서 직접 정의한 BusinessException */
  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException e) {
    ErrorCode errorCode = e.getErrorCode();
    log.warn("BusinessException Occurred: {}", e.getMessage());

    ApiResponse<Object> response = ApiResponse.error(errorCode.getCode(), errorCode.getMessage());
    return new ResponseEntity<>(response, errorCode.getStatus());
  }

  /* @Valid 어노테이션으로 인한 RequestBody 유효성 검사 실패 */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValid(
      MethodArgumentNotValidException e) {
    String errorMessage = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    log.warn("MethodArgumentNotValidException Occurred: {}", errorMessage);

    ApiResponse<Object> response = ApiResponse.error(HttpStatus.BAD_REQUEST.value(), errorMessage);
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }

  /* 지원하지 않는 HTTP Method 요청 */
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ApiResponse<Object>> handleResponseStatusException(ResponseStatusException e) {
    log.warn("ResponseStatusException Occurred: {}", e.getMessage());

    ApiResponse<Object> response = ApiResponse.error(e.getStatusCode().value(), e.getReason());
    return new ResponseEntity<>(response, e.getStatusCode());
  }

  /* 500 Internal Server Error */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Object>> handleException(Exception e) {
    log.error("Unhandled Exception Occurred: {}", e.getMessage(), e);

    ErrorCode internalError = ErrorCode.INTERNAL_SERVER_ERROR;
    ApiResponse<Object> response = ApiResponse.error(internalError.getCode(), internalError.getMessage());
    return new ResponseEntity<>(response, internalError.getStatus());
  }
}
