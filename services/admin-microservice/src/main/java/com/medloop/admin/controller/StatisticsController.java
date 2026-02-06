package com.medloop.admin.controller;

import com.medloop.admin.dto.StatisticsDTO;
import com.medloop.admin.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "APIs for system statistics and dashboard")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping
    @Operation(summary = "Get system statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    public ResponseEntity<StatisticsDTO> getStatistics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }

    @GetMapping("/overall")
    @Operation(summary = "Get overall system statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    public ResponseEntity<StatisticsDTO> getOverallStatistics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    public ResponseEntity<StatisticsDTO> getDashboardMetrics() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get all system metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        StatisticsDTO stats = statisticsService.getStatistics();
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalDoctors", stats.getTotalDoctors());
        metrics.put("activeDoctors", stats.getActiveDoctors());
        metrics.put("totalPatients", stats.getTotalPatients());
        metrics.put("activePatients", stats.getActivePatients());
        metrics.put("totalHospitals", stats.getTotalHospitals());
        metrics.put("totalBeds", stats.getTotalBeds());
        metrics.put("availableBeds", stats.getAvailableBeds());
        metrics.put("bedOccupancyRate", stats.getBedOccupancyRate());
        metrics.put("totalUsers", stats.getTotalDoctors() + stats.getTotalPatients());
        return ResponseEntity.ok(metrics);
    }
}
