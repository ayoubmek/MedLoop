package com.medloop.admin.controller;

import com.medloop.admin.dto.ApiResponse;
import com.medloop.admin.dto.PatientDTO;
import com.medloop.admin.service.AuditService;
import com.medloop.admin.service.PatientService;
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
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Tag(name = "Patient Management", description = "APIs for managing patients")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PatientController {

    private final PatientService patientService;
    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get all patients")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PatientDTO> createPatient(
            @Valid @RequestBody PatientDTO patientDTO,
            HttpServletRequest request) {
        PatientDTO created = patientService.createPatient(patientDTO);
        auditService.logAction("CREATE", "PATIENT", created.getId().toString(),
                "Created patient: " + created.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientDTO patientDTO,
            HttpServletRequest request) {
        PatientDTO updated = patientService.updatePatient(id, patientDTO);
        auditService.logAction("UPDATE", "PATIENT", id.toString(),
                "Updated patient: " + updated.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a patient")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePatient(
            @PathVariable Long id,
            HttpServletRequest request) {
        patientService.deletePatient(id);
        auditService.logAction("DELETE", "PATIENT", id.toString(),
                "Deleted patient with id: " + id, request);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted successfully", null));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get patients by doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<PatientDTO>> getPatientsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(patientService.getPatientsByDoctor(doctorId));
    }

    @PostMapping("/{patientId}/assign-doctor/{doctorId}")
    @Operation(summary = "Assign patient to doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<ApiResponse<Void>> assignPatientToDoctor(
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            HttpServletRequest request) {
        patientService.assignPatientToDoctor(patientId, doctorId);
        auditService.logAction("ASSIGN", "PATIENT", patientId.toString(),
                "Assigned patient " + patientId + " to doctor " + doctorId, request);
        return ResponseEntity.ok(ApiResponse.success("Patient assigned to doctor successfully", null));
    }

    @GetMapping("/search")
    @Operation(summary = "Search patients by name")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'GESTIONNAIRE')")
    public ResponseEntity<List<PatientDTO>> searchPatients(@RequestParam String name) {
        return ResponseEntity.ok(patientService.searchPatients(name));
    }

    @GetMapping("/blood-group/{bloodGroup}")
    @Operation(summary = "Get patients by blood group")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PatientDTO>> getPatientsByBloodGroup(@PathVariable String bloodGroup) {
        return ResponseEntity.ok(patientService.getPatientsByBloodGroup(bloodGroup));
    }
}
