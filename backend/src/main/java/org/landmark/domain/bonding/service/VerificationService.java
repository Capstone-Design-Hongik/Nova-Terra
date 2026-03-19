package org.landmark.domain.bonding.service;

import lombok.RequiredArgsConstructor;
import org.landmark.domain.bonding.domain.CreditReport;
import org.landmark.domain.bonding.domain.KycIdentity;
import org.landmark.domain.bonding.domain.VerificationStatus;
import org.landmark.domain.bonding.repository.CreditReportRepository;
import org.landmark.domain.bonding.repository.KycIdentityRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VerificationService {

    private final UserRepository userRepository;
    private final KycIdentityRepository kycIdentityRepository;
    private final CreditReportRepository creditReportRepository;

    private static final Set<VerificationStatus> VERIFIED_STATUSES =
            Set.of(VerificationStatus.PENDING_CHAIN, VerificationStatus.CONFIRMED);

    public void requireVerified(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getWalletAddress() == null) {
            throw new BusinessException(ErrorCode.KYC_NOT_VERIFIED);
        }

        String walletAddress = user.getWalletAddress();

        KycIdentity kyc = kycIdentityRepository
                .findTopByWalletAddressOrderByCreatedAtDesc(walletAddress)
                .orElseThrow(() -> new BusinessException(ErrorCode.KYC_NOT_VERIFIED));

        if (!VERIFIED_STATUSES.contains(kyc.getStatus())) {
            throw new BusinessException(ErrorCode.KYC_NOT_VERIFIED);
        }

        CreditReport credit = creditReportRepository
                .findTopByWalletAddressOrderByCreatedAtDesc(walletAddress)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREDIT_NOT_VERIFIED));

        if (!VERIFIED_STATUSES.contains(credit.getStatus())) {
            throw new BusinessException(ErrorCode.CREDIT_NOT_VERIFIED);
        }
    }
}
