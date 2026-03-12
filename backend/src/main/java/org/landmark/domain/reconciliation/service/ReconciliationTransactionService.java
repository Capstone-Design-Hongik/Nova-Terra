package org.landmark.domain.reconciliation.service;

import lombok.RequiredArgsConstructor;
import org.landmark.domain.reconciliation.domain.ReconciliationLog;
import org.landmark.domain.reconciliation.domain.ReconciliationType;
import org.landmark.domain.reconciliation.repository.ReconciliationLogRepository;
import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.repository.RentalIncomeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;

/**
 * Reconciliation DB 트랜잭션 전용 서비스
 * Self-invocation 문제 방지를 위해 분리
 */
@Service
@RequiredArgsConstructor
public class ReconciliationTransactionService {

    private final ReconciliationLogRepository reconciliationLogRepository;
    private final RentalIncomeRepository rentalIncomeRepository;

    @Transactional
    public void saveReconciliationLog(ReconciliationType type, String propertyId,
                                      Long offChainValue, BigInteger onChainValue,
                                      String referenceId) {
        ReconciliationLog logEntry = ReconciliationLog.builder()
                .type(type)
                .propertyId(propertyId)
                .offChainValue(offChainValue)
                .onChainValue(onChainValue)
                .referenceId(referenceId)
                .build();

        reconciliationLogRepository.save(logEntry);
    }

    @Transactional
    public void markDistributionAsFailed(String rentalIncomeId) {
        rentalIncomeRepository.findById(rentalIncomeId).ifPresent(income -> {
            income.failDistribution();
        });
    }

    @Transactional
    public void prepareRetry(RentalIncome income) {
        income.incrementRetryCount();
        income.resetToPending();
    }

    @Transactional
    public void completeRetry(RentalIncome income, String txHash) {
        income.completeDistribution(txHash);
    }

    @Transactional
    public void failRetry(RentalIncome income) {
        income.failDistribution();
    }
}
