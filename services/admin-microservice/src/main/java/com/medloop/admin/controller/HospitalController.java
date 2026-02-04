package com.medloop.admin.controller;

import com.medloop.admin.dto.ApiResponse;
import com.medloop.admin.dto.HospitalDTO;
import com.medloop.admin.service.AuditService;
import com.medloop.admin.service.HospitalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
@Tag(name = "Hospital Management", description = "APIs for managing hospitals")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class HospitalController {

    private final HospitalService hospitalService;
    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get all hospitals")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hospital by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<HospitalDTO> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new hospital")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDTO> createHospital(
            @Valid @RequestBody HospitalDTO hospitalDTO,
            HttpServletRequest request) {
        HospitalDTO created = hospitalService.createHospital(hospitalDTO);
        auditService.logAction("CREATE", "HOSPITAL", created.getId().toString(),
                "Created hospital: " + created.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a hospital")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDTO> updateHospital(
            @PathVariable Long id,
            @Valid @RequestBody HospitalDTO hospitalDTO,
            HttpServletRequest request) {
        HospitalDTO updated = hospitalService.updateHospital(id, hospitalDTO);
        auditService.logAction("UPDATE", "HOSPITAL", id.toString(),
                "Updated hospital: " + updated.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a hospital")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHospital(
            @PathVariable Long id,
            HttpServletRequest request) {
        hospitalService.deleteHospital(id);
        auditService.logAction("DELETE", "HOSPITAL", id.toString(),
                "Deleted hospital with id: " + id, request);
        return ResponseEntity.ok(ApiResponse.success("Hospital deleted successfully", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Search hospitals by name")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<HospitalDTO>> searchHospitals(@RequestParam String name) {
        return ResponseEntity.ok(hospitalService.searchHospitals(name));
    }

    @GetMapping("/available-beds")
    @Operation(summary = "Get hospitals with available beds")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<HospitalDTO>> getHospitalsWithAvailableBeds() {
        return ResponseEntity.ok(hospitalService.getHospitalsWithAvailableBeds());
    }
}
