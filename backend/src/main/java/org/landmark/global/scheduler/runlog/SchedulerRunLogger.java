package org.landmark.global.scheduler.runlog;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.scheduler.domain.SchedulerRunLog;
import org.landmark.global.scheduler.repository.SchedulerRunLogRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class SchedulerRunLogger {

    private final SchedulerRunLogRepository runLogRepository;

    public record Result(int processed, int failed) {}

    /**
     * 스케줄러 작업을 실행하고 시작/종료/실패를 DB에 기록.
     * 별도 트랜잭션으로 저장하여 작업 본체 트랜잭션과 독립.
     */
    public void run(String jobName, Supplier<Result> task) {
        SchedulerRunLog runLog = saveStart(jobName);
        try {
            Result result = task.get();
            saveFinish(runLog.getId(), result.processed(), result.failed());
        } catch (Exception e) {
            log.error("스케줄러 실행 실패 - jobName: {}", jobName, e);
            saveFailure(runLog.getId(), e.getMessage());
            throw e;
        }
    }

    public void runVoid(String jobName, Runnable task) {
        run(jobName, () -> {
            task.run();
            return new Result(0, 0);
        });
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected SchedulerRunLog saveStart(String jobName) {
        return runLogRepository.save(SchedulerRunLog.start(jobName));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void saveFinish(String id, int processed, int failed) {
        runLogRepository.findById(id).ifPresent(log -> log.finishSuccess(processed, failed));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void saveFailure(String id, String error) {
        runLogRepository.findById(id).ifPresent(log -> log.finishFailed(error));
    }
}
