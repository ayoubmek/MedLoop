package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.Ordonnance;
import com.MedLoop.patient_service.service.OrdonnanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordonnances")
public class OrdonnanceController {

  private final OrdonnanceService ordonnanceService;

  public OrdonnanceController(OrdonnanceService ordonnanceService) {
    this.ordonnanceService = ordonnanceService;
  }

  @GetMapping
  public List<Ordonnance> getAll() {
    return ordonnanceService.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Ordonnance> getById(@PathVariable Long id) {
    return ordonnanceService.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/dossier/{dossierId}")
  public List<Ordonnance> getByDossier(@PathVariable Long dossierId) {
    return ordonnanceService.getByDossierId(dossierId);
  }

  @PostMapping
  public Ordonnance create(@RequestBody Ordonnance ordonnance) {
    return ordonnanceService.save(ordonnance);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Ordonnance> update(@PathVariable Long id, @RequestBody Ordonnance ordonnance) {
    return ordonnanceService.getById(id)
      .map(existing -> {
        ordonnance.setId(existing.getId());
        return ResponseEntity.ok(ordonnanceService.save(ordonnance));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    ordonnanceService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
