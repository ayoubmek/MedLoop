package com.medloop.admin.service;

import com.medloop.admin.entity.AuditLog;
import com.medloop.admin.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void logAction(String action, String entityType, String entityId, String details, HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = "anonymous";
            String username = "anonymous";

            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                userId = jwt.getSubject();
                username = jwt.getClaimAsString("preferred_username");
            }

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .username(username)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .details(details)
                    .ipAddress(getClientIp(request))
                    .userAgent(request != null ? request.getHeader("User-Agent") : null)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS")
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created for action: {} on entity: {}/{}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log: {}", e.getMessage());
        }
    }

    public void logFailedAction(String action, String entityType, String entityId, String errorDetails, HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = "anonymous";
            String username = "anonymous";

            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                userId = jwt.getSubject();
                username = jwt.getClaimAsString("preferred_username");
            }

            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .username(username)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .details(errorDetails)
                    .ipAddress(getClientIp(request))
                    .userAgent(request != null ? request.getHeader("User-Agent") : null)
                    .timestamp(LocalDateTime.now())
                    .status("FAILED")
                    .build();

            auditLogRepository.save(auditLog);
            log.warn("Failed action logged: {} on entity: {}/{}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log for failed action: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogsByUser(String userId) {
        return auditLogRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getFailedOperations() {
        return auditLogRepository.findFailedOperations();
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findByTimestampBetween(start, end, pageable);
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
