package org.landmark.domain.properties.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BuildingType {
    OFFICETEL("오피스텔"),
    COMMERCIAL("상가"),
    APARTMENT("아파트"),
    VILLA("빌라/연립"),
    DETACHED_HOUSE("단독주택"),
    MULTI_FAMILY_HOUSE("다세대주택"),
    OFFICE("사무실/오피스 빌딩"),
    LAND("토지"),
    FACTORY_WAREHOUSE("공장/창고");

    private final String description;
}
