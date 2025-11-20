package org.landmark.properties.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Properties")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Property {
    @Id
    @Column(name = "sto_token_address", length = 42) // STO 토큰 주소를 PK로 사용
    private String id;

    @Column(name = "dao_token_address", length = 42, unique = true) //의결권(DAO) 토큰 주소
    private String daoTokenAddress;

    @Column(name = "dao_contract_address", length = 42, unique = true)  // 의사결정 DAO 토큰 주소
    private String daoContractAddress;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @Column
    private String address;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "building_type")
    private String buildingType;

    @Column(name = "exclusive_area_sqm")
    private BigDecimal exclusiveAreaSqm;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column
    private String floor;

    @Column(name = "use_approval_date")
    private Long useApprovalDate; // Unix time (Long)

    @Column(name = "parking_spaces")
    private Integer parkingSpaces;

    @Column
    private String direction;

    @Column(name = "room_count")
    private Integer roomCount;

    @Column(name = "bathroom_count")
    private Integer bathroomCount;

    @Column(name = "management_fee")
    private Long managementFee;

    @Column(name = "occupancy_rate")
    private BigDecimal occupancyRate;

    @Lob
    @Column(name = "major_tenants")
    private String majorTenants;

    @Column(name = "total_monthly_rent")
    private Long totalMonthlyRent;

    @Column(name = "total_valuation", nullable = false)
    private BigDecimal totalValuation;

    @Column(name = "total_tokens", nullable = false)
    private Long totalTokens;

    @Column(name = "expense_rate")
    private BigDecimal expenseRate;

    @Column(name = "fee_rate")
    private BigDecimal feeRate;

    /* 부동산 상품의 현재 상태 (청약중, 운영중, 비활성 등) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status;

    @Builder
    public Property(String stoTokenAddress, String daoTokenAddress, String daoContractAddress, String name, String description, String address, String coverImageUrl,
                    String buildingType, BigDecimal exclusiveAreaSqm, Integer totalFloors,
                    String floor, Long useApprovalDate, Integer parkingSpaces,
                    String direction, Integer roomCount, Integer bathroomCount,
                    Long managementFee, BigDecimal occupancyRate, String majorTenants,
                    Long totalMonthlyRent, BigDecimal totalValuation, Long totalTokens,
                    BigDecimal expenseRate, BigDecimal feeRate) {

        // 필수 값
        this.id = stoTokenAddress;
        this.daoTokenAddress = daoTokenAddress;
        this.daoContractAddress = daoContractAddress;
        this.name = name;
        this.totalValuation = totalValuation;
        this.totalTokens = totalTokens;
        this.description = description;
        this.address = address;
        this.coverImageUrl = coverImageUrl;
        this.buildingType = buildingType;
        this.exclusiveAreaSqm = exclusiveAreaSqm;
        this.totalFloors = totalFloors;
        this.floor = floor;
        this.useApprovalDate = useApprovalDate;
        this.parkingSpaces = parkingSpaces;
        this.direction = direction;
        this.roomCount = roomCount;
        this.bathroomCount = bathroomCount;
        this.managementFee = managementFee;
        this.occupancyRate = occupancyRate;
        this.majorTenants = majorTenants;
        this.totalMonthlyRent = totalMonthlyRent;
        this.expenseRate = expenseRate;
        this.feeRate = feeRate;


        // 초기 상태값 설정
        this.status = PropertyStatus.FUNDING; // 관리자가 등록 시 '청약 중' 상태로 시작
    }

    /* 상품 상태 '비활성'으로 변경. */
    public void deactivate() {
        this.status = PropertyStatus.INACTIVE;
    }

    /* 청약 완료되면 상품 상태 '운영 중'으로 변경. */
    public void activate() {
        if (this.status == PropertyStatus.FUNDING) {
            this.status = PropertyStatus.ACTIVE;
        }
    }
}
