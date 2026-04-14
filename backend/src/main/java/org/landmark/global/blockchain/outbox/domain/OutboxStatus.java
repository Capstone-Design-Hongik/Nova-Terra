package org.landmark.global.blockchain.outbox.domain;

public enum OutboxStatus {
    READY,
    SUBMITTED,
    CONFIRMED,
    FINALIZED,
    FAILED,
    DEAD
}
