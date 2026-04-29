package org.landmark.global.scheduler.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "SchedulerRunLogs", indexes = {
        @Index(name = "idx_scheduler_run_job_started", columnList = "job_name, started_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SchedulerRunLog {

    @Id
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "job_name", nullable = false, length = 100)
    private String jobName;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SchedulerRunStatus status;

    @Column(name = "processed_count", nullable = false)
    private int processedCount;

    @Column(name = "failed_count", nullable = false)
    private int failedCount;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    public static SchedulerRunLog start(String jobName) {
        SchedulerRunLog log = new SchedulerRunLog();
        log.id = UUID.randomUUID().toString();
        log.jobName = jobName;
        log.startedAt = LocalDateTime.now();
        log.status = SchedulerRunStatus.RUNNING;
        log.processedCount = 0;
        log.failedCount = 0;
        return log;
    }

    public void finishSuccess(int processed, int failed) {
        this.finishedAt = LocalDateTime.now();
        this.status = SchedulerRunStatus.SUCCESS;
        this.processedCount = processed;
        this.failedCount = failed;
    }

    public void finishFailed(String error) {
        this.finishedAt = LocalDateTime.now();
        this.status = SchedulerRunStatus.FAILED;
        this.errorMessage = error != null && error.length() > 1000 ? error.substring(0, 1000) : error;
    }
}
