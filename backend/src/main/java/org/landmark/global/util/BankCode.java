package org.landmark.global.util;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BankCode {

    // 시중은행
    KB_BANK("06", "국민은행"),
    SHINHAN_BANK("88", "신한은행"),
    WOORI_BANK("20", "우리은행"),
    HANA_BANK("81", "하나은행"),
    IBK_BANK("03", "기업은행"),
    KDB_BANK("02", "산업은행"),
    NH_BANK("11", "농협은행"),
    SH_BANK("07", "수협은행"),

    // 지방은행
    BUSAN_BANK("32", "부산은행"),
    DAEGU_BANK("31", "대구은행"),
    JEONBUK_BANK("37", "전북은행"),
    GWANGJU_BANK("34", "광주은행"),
    JEJU_BANK("35", "제주은행"),
    KYONGNAM_BANK("39", "경남은행"),

    // 특수은행
    POST_BANK("71", "우체국예금보험"),
    SAVING_BANK("50", "저축은행중앙회"),

    // 인터넷은행
    KAKAO_BANK("90", "카카오뱅크"),
    K_BANK("89", "케이뱅크"),
    TOSS_BANK("92", "토스뱅크"),

    // 외국계은행
    SC_BANK("23", "SC제일은행"),
    CITI_BANK("27", "한국씨티은행"),
    HSBC_BANK("54", "홍콩상하이은행"),

    // 기타
    NONGHYUP("12", "단위농협"),
    SAEMAUL("45", "새마을금고"),
    SHINHEOP("48", "신협"),
    SAN림("64", "산림조합");

    private final String code;
    private final String name;

    /* 은행 코드로 은행명 조회 */
    public static String getNameByCode(String code) {
        for (BankCode bank : values()) {
            if (bank.code.equals(code)) {
                return bank.name;
            }
        }
        return "알 수 없는 은행";
    }

    /* 은행명으로 은행 코드 조회 */
    public static String getCodeByName(String name) {
        for (BankCode bank : values()) {
            if (bank.name.equals(name)) {
                return bank.code;
            }
        }
        return null;
    }
}
