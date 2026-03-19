package org.landmark.domain.bonding.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.bonding.domain.CreditReport;
import org.landmark.domain.bonding.domain.KycIdentity;
import org.landmark.domain.bonding.domain.VerificationStatus;
import org.landmark.domain.bonding.dto.CreditStartRequest;
import org.landmark.domain.bonding.dto.CreditStatusResponse;
import org.landmark.domain.bonding.dto.KycValidateRequest;
import org.landmark.domain.bonding.dto.VerificationResponse;
import org.landmark.domain.bonding.repository.CreditReportRepository;
import org.landmark.domain.bonding.repository.KycIdentityRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.landmark.global.blockchain.service.BlockchainWalletService;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BondingService {

    private final KycIdentityRepository kycIdentityRepository;
    private final CreditReportRepository creditReportRepository;
    private final UserRepository userRepository;
    private final BlockchainWalletService blockchainWalletService;
    private final ObjectMapper objectMapper;
    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${stripe.base-url:https://api.stripe.com}")
    private String stripeBaseUrl;

    @Value("${plaid.client-id:}")
    private String plaidClientId;

    @Value("${plaid.secret:}")
    private String plaidSecret;

    @Value("${plaid.base-url:https://sandbox.plaid.com}")
    private String plaidBaseUrl;

    @Value("${plaid.webhook-url:}")
    private String plaidWebhookUrl;

    private RestTemplate restTemplate;

    @PostConstruct
    void init() {
        this.restTemplate = restTemplateBuilder
                .connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(20))
                .build();
    }

    @Transactional
    public String validateKyc(String userId, KycValidateRequest request) {
        String walletAddress = getUserWalletAddress(userId);

        if (kycIdentityRepository.findBySessionId(request.sessionId()).isPresent()) {
            throw new BusinessException(ErrorCode.KYC_SESSION_ALREADY_USED);
        }

        StripeVerificationSessionResponse session = fetchStripeSession(request.sessionId());
        if (!"verified".equalsIgnoreCase(session.status)) {
            throw new BusinessException(ErrorCode.KYC_NOT_VERIFIED);
        }

        String idHash = hashJson(session.verifiedOutputs);
        KycIdentity kyc = KycIdentity.pending(walletAddress, request.agentId(), request.sessionId(), idHash);
        kycIdentityRepository.save(kyc);

        try {
            String txHash = blockchainWalletService.submitKycVerification(walletAddress, idHash);
            kyc.setTxHash(txHash);
            log.info("KYC 온체인 제출 완료 - walletAddress: {}, txHash: {}", walletAddress, txHash);
        } catch (BusinessException e) {
            if (e.getErrorCode() == ErrorCode.BLOCKCHAIN_NOT_INITIALIZED) {
                log.warn("블록체인 미설정 - KYC 온체인 제출 생략");
            } else {
                throw e;
            }
        }

        return kyc.getIdHash();
    }

    @Transactional
    public String startCredit(String userId, CreditStartRequest request) {
        String walletAddress = getUserWalletAddress(userId);

        Optional<CreditReport> latestOpt = creditReportRepository
                .findTopByWalletAddressOrderByCreatedAtDesc(walletAddress);

        if (latestOpt.isPresent()) {
            CreditReport existing = latestOpt.get();
            if (existing.getStatus() == VerificationStatus.PENDING_CHAIN
                    || existing.getStatus() == VerificationStatus.CONFIRMED) {
                throw new BusinessException(ErrorCode.CREDIT_ALREADY_VERIFIED);
            }
            // STARTED 또는 PENDING_REPORT: 기존 Plaid 유저 재사용, 새 link 토큰만 발급
            if (existing.getStatus() == VerificationStatus.STARTED
                    || existing.getStatus() == VerificationStatus.PENDING_REPORT) {
                log.info("기존 Plaid 유저 재사용 - walletAddress: {}", walletAddress);
                return createLinkToken(walletAddress, existing.getPlaidUserId());
            }
        }

        String plaidUserId = createPlaidUser(request, walletAddress);
        creditReportRepository.save(CreditReport.started(walletAddress, request.agentId(), plaidUserId));
        return createLinkToken(walletAddress, plaidUserId);
    }

    @Transactional
    public VerificationResponse validateCredit(String userId) {
        String walletAddress = getUserWalletAddress(userId);

        CreditReport report = creditReportRepository
                .findTopByWalletAddressOrderByCreatedAtDesc(walletAddress)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREDIT_NOT_STARTED));

        PlaidReport plaidReport;
        try {
            plaidReport = fetchBaseReport(report.getPlaidUserId());
        } catch (BusinessException e) {
            if (e.getErrorCode() == ErrorCode.PLAID_REPORT_NOT_READY) {
                report.markPendingReport();
                return VerificationResponse.pendingReport();
            }
            throw e;
        }

        int score = computeScore(plaidReport);
        String grade = gradeFromScore(score);
        String reportHash = hashString(plaidReport.reportId + ":" + score + ":" + walletAddress);

        String txHash = null;
        try {
            txHash = blockchainWalletService.submitCreditVerification(walletAddress, reportHash, score);
            log.info("Credit 온체인 제출 완료 - walletAddress: {}, txHash: {}", walletAddress, txHash);
        } catch (BusinessException e) {
            if (e.getErrorCode() == ErrorCode.BLOCKCHAIN_NOT_INITIALIZED) {
                log.warn("블록체인 미설정 - Credit 온체인 제출 생략");
            } else {
                throw e;
            }
        }

        report.markPendingChain(plaidReport.reportId, score, grade, reportHash, txHash);
        return VerificationResponse.creditPendingChain(reportHash, score, grade);
    }

    @Transactional(readOnly = true)
    public CreditStatusResponse latestCredit(String userId) {
        String walletAddress = getUserWalletAddress(userId);
        CreditReport report = creditReportRepository
                .findTopByWalletAddressOrderByCreatedAtDesc(walletAddress)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREDIT_NOT_FOUND));
        return CreditStatusResponse.from(report);
    }

    // ── Private Helpers ──────────────────────────────────────────────────────

    private String getUserWalletAddress(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (user.getWalletAddress() == null) {
            throw new BusinessException(ErrorCode.WALLET_NOT_LINKED);
        }
        return user.getWalletAddress();
    }

    private StripeVerificationSessionResponse fetchStripeSession(String sessionId) {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new BusinessException(ErrorCode.STRIPE_NOT_CONFIGURED);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(stripeSecretKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url = stripeBaseUrl + "/v1/identity/verification_sessions/" + sessionId;
        try {
            ResponseEntity<StripeVerificationSessionResponse> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, StripeVerificationSessionResponse.class);

            StripeVerificationSessionResponse body = response.getBody();
            if (body == null) throw new BusinessException(ErrorCode.KYC_SESSION_NOT_FOUND);
            return body;
        } catch (HttpClientErrorException.NotFound e) {
            throw new BusinessException(ErrorCode.KYC_SESSION_NOT_FOUND);
        }
    }

    private String createPlaidUser(CreditStartRequest request, String walletAddress) {
        ensurePlaidConfigured();

        Map<String, Object> body = Map.of(
                "client_id", plaidClientId,
                "secret", plaidSecret,
                "client_user_id", walletAddress,
                "consumer_report_user_identity", Map.of(
                        "name", Map.of(
                                "given_name", request.givenName(),
                                "family_name", request.familyName()
                        ),
                        "date_of_birth", request.dateOfBirth(),
                        "emails", List.of(Map.of("data", request.email(), "primary", true)),
                        "phone_numbers", List.of(Map.of("data", request.phoneNumber(), "primary", true)),
                        "addresses", List.of(Map.of(
                                "street", request.street(),
                                "city", request.city(),
                                "region", request.region(),
                                "postal_code", request.postalCode(),
                                "country", request.country(),
                                "primary", true
                        ))
                )
        );

        ResponseEntity<PlaidUserCreateResponse> response = restTemplate.postForEntity(
                plaidBaseUrl + "/user/create", body, PlaidUserCreateResponse.class
        );
        PlaidUserCreateResponse payload = response.getBody();
        if (payload == null || payload.userId == null) {
            throw new BusinessException(ErrorCode.PLAID_REQUEST_FAILED);
        }
        return payload.userId;
    }

    private String createLinkToken(String walletAddress, String plaidUserId) {
        ensurePlaidConfigured();

        Map<String, Object> body = Map.of(
                "client_id", plaidClientId,
                "secret", plaidSecret,
                "client_name", "Nova-Terra",
                "language", "en",
                "country_codes", List.of("US"),
                "products", List.of("cra_base_report"),
                "user", Map.of(
                        "client_user_id", walletAddress,
                        "user_id", plaidUserId
                ),
                "consumer_report_permissible_purpose", "ACCOUNT_REVIEW_CREDIT",
                "cra_options", Map.of("days_requested", 365),
                "webhook", plaidWebhookUrl == null ? "" : plaidWebhookUrl
        );

        ResponseEntity<PlaidLinkTokenResponse> response = restTemplate.postForEntity(
                plaidBaseUrl + "/link/token/create", body, PlaidLinkTokenResponse.class
        );
        PlaidLinkTokenResponse payload = response.getBody();
        if (payload == null || payload.linkToken == null) {
            throw new BusinessException(ErrorCode.PLAID_REQUEST_FAILED);
        }
        return payload.linkToken;
    }

    private PlaidReport fetchBaseReport(String plaidUserId) {
        ensurePlaidConfigured();

        Map<String, Object> body = Map.of(
                "client_id", plaidClientId,
                "secret", plaidSecret,
                "user_id", plaidUserId
        );

        try {
            ResponseEntity<PlaidBaseReportResponse> response = restTemplate.postForEntity(
                    plaidBaseUrl + "/cra/check_report/base_report/get", body, PlaidBaseReportResponse.class
            );
            PlaidBaseReportResponse payload = response.getBody();
            if (payload == null || payload.report == null || payload.report.reportId == null) {
                throw new BusinessException(ErrorCode.PLAID_REQUEST_FAILED);
            }
            return payload.report;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new BusinessException(ErrorCode.PLAID_REPORT_NOT_READY);
            }
            throw e;
        }
    }

    /**
     * 실제 Plaid CRA 데이터를 기반으로 신용 점수를 계산합니다 (0~100).
     * - 평균 잔액: 최대 30점
     * - 현금 흐름 비율(inflow/outflow): 최대 40점
     * - 계좌 이력(days_available): 최대 30점
     */
    private static int computeScore(PlaidReport report) {
        if (report.accounts == null || report.accounts.isEmpty()) {
            return 30;
        }

        double totalBalance = 0;
        double totalInflows = 0;
        double totalOutflows = 0;
        int maxDays = 0;
        int count = 0;

        for (PlaidAccount account : report.accounts) {
            if (account.balances != null && account.balances.current != null) {
                totalBalance += account.balances.current;
            }
            if (account.creditDetails != null) {
                if (account.creditDetails.totalInflows != null) totalInflows += account.creditDetails.totalInflows;
                if (account.creditDetails.totalOutflows != null) totalOutflows += account.creditDetails.totalOutflows;
            }
            maxDays = Math.max(maxDays, account.daysAvailable);
            count++;
        }

        double avgBalance = count > 0 ? totalBalance / count : 0;

        // 잔액 점수 (0-30)
        int balanceScore;
        if (avgBalance >= 10_000) balanceScore = 30;
        else if (avgBalance >= 5_000) balanceScore = 20;
        else if (avgBalance >= 2_000) balanceScore = 15;
        else if (avgBalance >= 500)   balanceScore = 10;
        else                          balanceScore = 5;

        // 현금 흐름 점수 (0-40)
        int cashFlowScore;
        if (totalOutflows == 0) {
            cashFlowScore = totalInflows > 0 ? 40 : 20;
        } else {
            double ratio = totalInflows / totalOutflows;
            if      (ratio >= 1.5) cashFlowScore = 40;
            else if (ratio >= 1.2) cashFlowScore = 35;
            else if (ratio >= 1.0) cashFlowScore = 25;
            else if (ratio >= 0.8) cashFlowScore = 15;
            else                   cashFlowScore = 5;
        }

        // 이력 점수 (0-30)
        int historyScore;
        if      (maxDays >= 180) historyScore = 30;
        else if (maxDays >= 90)  historyScore = 20;
        else if (maxDays >= 30)  historyScore = 15;
        else                     historyScore = 5;

        return balanceScore + cashFlowScore + historyScore;
    }

    private static String gradeFromScore(int score) {
        if (score >= 75) return "A";
        if (score >= 50) return "B";
        return "C";
    }

    private void ensurePlaidConfigured() {
        if (plaidClientId == null || plaidClientId.isBlank() || plaidSecret == null || plaidSecret.isBlank()) {
            throw new BusinessException(ErrorCode.PLAID_NOT_CONFIGURED);
        }
    }

    private String hashJson(Object value) {
        try {
            String json = objectMapper.writeValueAsString(value == null ? Map.of() : value);
            return hashString(json);
        } catch (JsonProcessingException e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private static String hashString(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    // ── Plaid / Stripe Response DTOs (internal) ───────────────────────────────

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class StripeVerificationSessionResponse {
        public String status;
        @JsonProperty("verified_outputs")
        public Map<String, Object> verifiedOutputs;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidUserCreateResponse {
        @JsonProperty("user_id")
        public String userId;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidLinkTokenResponse {
        @JsonProperty("link_token")
        public String linkToken;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidBaseReportResponse {
        public PlaidReport report;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidReport {
        @JsonProperty("report_id")
        public String reportId;
        public List<PlaidAccount> accounts;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidAccount {
        public PlaidBalances balances;
        @JsonProperty("days_available")
        public int daysAvailable;
        @JsonProperty("credit_details")
        public PlaidCreditDetails creditDetails;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidBalances {
        public Double current;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PlaidCreditDetails {
        @JsonProperty("total_inflows")
        public Double totalInflows;
        @JsonProperty("total_outflows")
        public Double totalOutflows;
    }
}
