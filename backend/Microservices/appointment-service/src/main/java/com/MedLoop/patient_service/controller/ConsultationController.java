package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.Consultation;
import com.MedLoop.patient_service.service.ConsultationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

  private final ConsultationService consultationService;

  public ConsultationController(ConsultationService consultationService) {
    this.consultationService = consultationService;
  }

  @GetMapping
  public List<Consultation> getAll() {
    return consultationService.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Consultation> getById(@PathVariable Long id) {
    return consultationService.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/patient/{patientId}")
  public List<Consultation> getByPatient(@PathVariable Long patientId) {
    return consultationService.getByPatientId(patientId);
  }

  @PostMapping
  public Consultation create(@RequestBody Consultation consultation) {
    return consultationService.save(consultation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Consultation> update(@PathVariable Long id, @RequestBody Consultation consultation) {
    return consultationService.getById(id)
      .map(existing -> {
        consultation.setId(existing.getId());
        return ResponseEntity.ok(consultationService.save(consultation));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    consultationService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
