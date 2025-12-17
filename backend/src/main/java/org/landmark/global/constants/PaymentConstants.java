package org.landmark.global.constants;

import org.landmark.global.util.BankCode;


public class PaymentConstants {

    private PaymentConstants() {
        throw new IllegalStateException("Constants class");
    }

    // 기본 가상계좌 은행
    public static final String DEFAULT_VIRTUAL_ACCOUNT_BANK_CODE = BankCode.WOORI_BANK.getCode();

    // 가상계좌 유효 시간 (시간 단위)
    public static final String VIRTUAL_ACCOUNT_VALID_HOURS = "24";

    // 임대 수익용 고정 가상계좌 유효 시간 (90일, 토스 API 최대값)
    public static final String RENTAL_VIRTUAL_ACCOUNT_VALID_HOURS = "2160";

    // 임대 수익용 가상계좌 발급 시 임시 금액 (토스 API 요구사항)
    public static final Long RENTAL_VIRTUAL_ACCOUNT_TEMP_AMOUNT = 1L;

    // 결제 방식
    public static final String PAYMENT_METHOD_VIRTUAL_ACCOUNT = "VIRTUAL_ACCOUNT";

    // 임대인 기본 이름 (정보 없을 시)
    public static final String DEFAULT_TENANT_NAME = "증권사";
}
