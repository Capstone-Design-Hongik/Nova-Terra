package org.landmark.global.scheduler.repository;

import org.landmark.global.scheduler.domain.SchedulerRunLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchedulerRunLogRepository extends JpaRepository<SchedulerRunLog, String> {

    List<SchedulerRunLog> findAllByOrderByStartedAtDesc(Pageable pageable);

    List<SchedulerRunLog> findByJobNameOrderByStartedAtDesc(String jobName, Pageable pageable);
}
