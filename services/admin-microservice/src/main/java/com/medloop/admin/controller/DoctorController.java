package com.medloop.admin.controller;

import com.medloop.admin.dto.ApiResponse;
import com.medloop.admin.dto.DoctorDTO;
import com.medloop.admin.service.AuditService;
import com.medloop.admin.service.DoctorService;
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
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor Management", description = "APIs for managing doctors")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class DoctorController {

    private final DoctorService doctorService;
    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get all doctors")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorDTO> createDoctor(
            @Valid @RequestBody DoctorDTO doctorDTO,
            HttpServletRequest request) {
        DoctorDTO created = doctorService.createDoctor(doctorDTO);
        auditService.logAction("CREATE", "DOCTOR", created.getId().toString(),
                "Created doctor: " + created.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTIONNAIRE')")
    public ResponseEntity<DoctorDTO> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDTO doctorDTO,
            HttpServletRequest request) {
        DoctorDTO updated = doctorService.updateDoctor(id, doctorDTO);
        auditService.logAction("UPDATE", "DOCTOR", id.toString(),
                "Updated doctor: " + updated.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(
            @PathVariable Long id,
            HttpServletRequest request) {
        doctorService.deleteDoctor(id);
        auditService.logAction("DELETE", "DOCTOR", id.toString(),
                "Deleted doctor with id: " + id, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully", null));
    }

    @GetMapping("/hospital/{hospitalId}")
    @Operation(summary = "Get doctors by hospital")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(doctorService.getDoctorsByHospital(hospitalId));
    }

    @PostMapping("/{doctorId}/assign-hospital/{hospitalId}")
    @Operation(summary = "Assign doctor to hospital")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignDoctorToHospital(
            @PathVariable Long doctorId,
            @PathVariable Long hospitalId,
            HttpServletRequest request) {
        doctorService.assignDoctorToHospital(doctorId, hospitalId);
        auditService.logAction("ASSIGN", "DOCTOR", doctorId.toString(),
                "Assigned doctor " + doctorId + " to hospital " + hospitalId, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor assigned to hospital successfully", null));
    }

    @GetMapping("/specialization/{specialization}")
    @Operation(summary = "Get doctors by specialization")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    @GetMapping("/specializations")
    @Operation(summary = "Get all specializations")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<String>> getAllSpecializations() {
        return ResponseEntity.ok(doctorService.getAllSpecializations());
    }

    @GetMapping("/search")
    @Operation(summary = "Search doctors by name")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam String name) {
        return ResponseEntity.ok(doctorService.searchDoctors(name));
    }
}
