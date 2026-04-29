package org.landmark.global.blockchain.outbox.service;

import lombok.RequiredArgsConstructor;
import org.landmark.global.blockchain.outbox.domain.BlockchainOutbox;
import org.landmark.global.blockchain.outbox.domain.OutboxStatus;
import org.landmark.global.blockchain.outbox.repository.BlockchainOutboxRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Outbox worker 전용 트랜잭션 경계 서비스 */
@Service
@RequiredArgsConstructor
public class OutboxTransactionService {

    private final BlockchainOutboxRepository outboxRepository;

    @Transactional
    public List<BlockchainOutbox> lockReadyBatch(int batchSize) {
        return outboxRepository.findReadyForProcessing(OutboxStatus.READY, PageRequest.of(0, batchSize));
    }

    @Transactional
    public void markSubmitted(String id, Long nonce, String txHash) {
        BlockchainOutbox o = outboxRepository.findById(id).orElseThrow();
        o.markSubmitted(nonce, txHash);
    }

    @Transactional
    public void markFailed(String id, String error, int maxRetry) {
        BlockchainOutbox o = outboxRepository.findById(id).orElseThrow();
        o.markFailed(error);
        if (!o.isRetryable(maxRetry)) {
            o.markDead(error);
        } else {
            o.resetToReady();
        }
    }

    @Transactional
    public void markConfirmed(String id) {
        BlockchainOutbox o = outboxRepository.findById(id).orElseThrow();
        o.markConfirmed();
    }
}
