package com.medloop.admin.repository;

import com.medloop.admin.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(String userId);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByEntityType(String entityType);

    Page<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId AND a.timestamp BETWEEN :start AND :end")
    List<AuditLog> findByUserIdAndTimeRange(
            @Param("userId") String userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT a FROM AuditLog a WHERE a.status = 'FAILED' ORDER BY a.timestamp DESC")
    List<AuditLog> findFailedOperations();

    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
