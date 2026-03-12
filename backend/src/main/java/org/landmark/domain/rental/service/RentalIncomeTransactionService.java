package org.landmark.domain.rental.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.rental.domain.PropertyVirtualAccount;
import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.repository.PropertyVirtualAccountRepository;
import org.landmark.domain.rental.repository.RentalIncomeRepository;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * RentalIncome DB 트랜잭션 전용 서비스
 *
 * RentalIncomeService에서 블록체인 호출과 DB 트랜잭션을 분리하기 위해
 * DB 작업만 담당하는 별도 서비스.
 * Spring AOP 프록시의 self-invocation 문제를 해결합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RentalIncomeTransactionService {

    private final RentalIncomeRepository rentalIncomeRepository;
    private final PropertyVirtualAccountRepository propertyVirtualAccountRepository;

    @Transactional
    public RentalIncome saveRentalIncome(String accountNumberOrOrderId, String paymentKey, Long amount) {
        PropertyVirtualAccount virtualAccount = propertyVirtualAccountRepository
                .findByVirtualAccountNumber(accountNumberOrOrderId)
                .or(() -> propertyVirtualAccountRepository.findByTossOrderId(accountNumberOrOrderId))
                .orElseThrow(() -> {
                    log.error("가상계좌를 찾을 수 없습니다 - accountNumberOrOrderId: {}", accountNumberOrOrderId);
                    return new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND);
                });

        log.info("가상계좌 조회 성공 - propertyId: {}, accountNumber: {}",
                virtualAccount.getPropertyId(), virtualAccount.getVirtualAccountNumber());

        RentalIncome rentalIncome = RentalIncome.builder()
                .propertyId(virtualAccount.getPropertyId())
                .amount(amount)
                .tenantName(null)
                .tossOrderId(virtualAccount.getTossOrderId())
                .build();

        rentalIncome.completeDeposit(paymentKey);
        return rentalIncomeRepository.save(rentalIncome);
    }

    @Transactional
    public void updateDistributionSuccess(String rentalIncomeId, String txHash) {
        RentalIncome income = rentalIncomeRepository.findById(rentalIncomeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RENTAL_INCOME_NOT_FOUND));
        income.completeDistribution(txHash);
    }

    @Transactional
    public void updateDistributionFailed(String rentalIncomeId) {
        RentalIncome income = rentalIncomeRepository.findById(rentalIncomeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RENTAL_INCOME_NOT_FOUND));
        income.failDistribution();
    }

    @Transactional
    public void incrementRetryAndResetToPending(String rentalIncomeId) {
        RentalIncome income = rentalIncomeRepository.findById(rentalIncomeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RENTAL_INCOME_NOT_FOUND));
        income.incrementRetryCount();
        income.resetToPending();
    }
}
