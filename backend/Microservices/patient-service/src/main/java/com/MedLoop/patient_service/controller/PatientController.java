package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.dto.PatientDTO;
import com.MedLoop.patient_service.entity.Patient;
import com.MedLoop.patient_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @GetMapping
  public List<PatientDTO> getAll() {
    return patientService.getAllPatients()
      .stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<PatientDTO> getById(@PathVariable Long id) {
    return patientService.getPatientById(id)
      .map(this::convertToDTO)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public Patient create(@RequestBody Patient patient) {
    return patientService.savePatient(patient);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient patient) {
    return patientService.getPatientById(id)
      .map(existing -> {
        patient.setId(existing.getId());
        return ResponseEntity.ok(patientService.savePatient(patient));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    patientService.deletePatient(id);
    return ResponseEntity.noContent().build();
  }

  private PatientDTO convertToDTO(Patient patient) {
    return new PatientDTO(
      patient.getId(),
      patient.getNom(),
      patient.getPrenom(),
      patient.getCin(),
      patient.getTelephone(),
      patient.getImage()
    );
  }

}
