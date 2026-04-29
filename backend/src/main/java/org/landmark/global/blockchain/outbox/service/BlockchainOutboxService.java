package org.landmark.global.blockchain.outbox.service;

import lombok.RequiredArgsConstructor;
import org.landmark.global.blockchain.outbox.domain.BlockchainOutbox;
import org.landmark.global.blockchain.outbox.domain.OutboxTxType;
import org.landmark.global.blockchain.outbox.repository.BlockchainOutboxRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlockchainOutboxService {

    private final BlockchainOutboxRepository outboxRepository;

    /** KRWT mint 아웃박스 등록 */
    @Transactional
    public BlockchainOutbox enqueueKrwtMint(String aggregateType, String aggregateId,
                                             String krwtContractAddress, String toAddress, String amount) {
        BlockchainOutbox outbox = BlockchainOutbox.builder()
                .aggregateType(aggregateType)
                .aggregateId(aggregateId)
                .txType(OutboxTxType.KRWT_MINT)
                .contractAddress(krwtContractAddress)
                .toAddress(toAddress)
                .amount(amount)
                .build();
        return outboxRepository.save(outbox);
    }
}
