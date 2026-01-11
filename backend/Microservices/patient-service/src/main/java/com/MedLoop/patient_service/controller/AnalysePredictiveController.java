package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.AnalysePredictive;
import com.MedLoop.patient_service.service.AnalysePredictiveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyses")
public class AnalysePredictiveController {

  private final AnalysePredictiveService service;

  public AnalysePredictiveController(AnalysePredictiveService service) {
    this.service = service;
  }

  @GetMapping
  public List<AnalysePredictive> getAll() {
    return service.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<AnalysePredictive> getById(@PathVariable Long id) {
    return service.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/dossier/{dossierId}")
  public List<AnalysePredictive> getByDossier(@PathVariable Long dossierId) {
    return service.getByDossierId(dossierId);
  }

  @PostMapping
  public AnalysePredictive create(@RequestBody AnalysePredictive analyse) {
    return service.save(analyse);
  }

  @PutMapping("/{id}")
  public ResponseEntity<AnalysePredictive> update(@PathVariable Long id, @RequestBody AnalysePredictive analyse) {
    return service.getById(id)
      .map(existing -> {
        analyse.setId(existing.getId());
        return ResponseEntity.ok(service.save(analyse));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}

