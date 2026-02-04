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
}
