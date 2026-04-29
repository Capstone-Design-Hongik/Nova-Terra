package org.landmark.global.blockchain.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.blockchain.config.BlockchainConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;

import java.math.BigInteger;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Component
public class NonceManager {

    @Nullable
    private final Web3j web3j;
    @Nullable
    private final Credentials credentials;
    private final BlockchainConfig blockchainConfig;
    private final AtomicLong currentNonce = new AtomicLong(-1);

    @Autowired
    public NonceManager(@Nullable Web3j web3j,
                        @Nullable Credentials credentials,
                        BlockchainConfig blockchainConfig) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.blockchainConfig = blockchainConfig;
    }

    @PostConstruct
    public void init() {
        if (web3j == null || credentials == null) {
            log.warn("NonceManager 초기화 스킵 - Web3j/Credentials 미초기화");
            return;
        }
        try {
            refreshFromChain();
            log.info("NonceManager 초기화 완료 - 시작 nonce: {}", currentNonce.get());
        } catch (Exception e) {
            log.error("NonceManager 초기화 실패 - chain에서 nonce 조회 불가", e);
        }
    }

    public synchronized long nextNonce() {
        if (currentNonce.get() < 0) {
            refreshFromChain();
        }
        return currentNonce.getAndIncrement();
    }

    public synchronized void refreshFromChain() {
        if (web3j == null || credentials == null) {
            throw new IllegalStateException("Web3j/Credentials 미초기화");
        }
        try {
            EthGetTransactionCount response = web3j.ethGetTransactionCount(
                    credentials.getAddress(),
                    DefaultBlockParameterName.PENDING
            ).send();
            BigInteger chainNonce = response.getTransactionCount();
            currentNonce.set(chainNonce.longValue());
            log.info("Nonce 재동기화 - address: {}, nonce: {}", credentials.getAddress(), chainNonce);
        } catch (Exception e) {
            throw new RuntimeException("Nonce 동기화 실패", e);
        }
    }

    public synchronized void rollback(long failedNonce) {
        long current = currentNonce.get();
        if (failedNonce == current - 1) {
            currentNonce.decrementAndGet();
            log.warn("Nonce 롤백 - {} → {}", current, currentNonce.get());
        } else {
            log.warn("Nonce 롤백 스킵 (gap 발생 가능) - failed: {}, current: {}. refreshFromChain 권장",
                    failedNonce, current);
        }
    }
}
