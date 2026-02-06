package com.medloop.admin.controller;

import com.medloop.admin.entity.AuditLog;
import com.medloop.admin.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "APIs for viewing audit logs - Security Officer access")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get all audit logs with pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_SECURITE')")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.getAuditLogs(page, size));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get audit logs with pagination - Dashboard endpoint")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE', 'RESPONSABLE_SECURITE')")
    public ResponseEntity<Page<AuditLog>> getAuditLogsDashboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(auditService.getAuditLogs(page, size));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get audit logs by user")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_SECURITE')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(auditService.getAuditLogsByUser(userId));
    }

    @GetMapping("/failed")
    @Operation(summary = "Get failed operations")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_SECURITE')")
    public ResponseEntity<List<AuditLog>> getFailedOperations() {
        return ResponseEntity.ok(auditService.getFailedOperations());
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get audit logs by date range")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE_SECURITE')")
    public ResponseEntity<Page<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.getAuditLogsByDateRange(start, end, page, size));
    }
}
