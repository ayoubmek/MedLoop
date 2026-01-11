package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.Medicament;
import com.MedLoop.patient_service.service.MedicamentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaments")
public class MedicamentController {

  private final MedicamentService medicamentService;

  public MedicamentController(MedicamentService medicamentService) {
    this.medicamentService = medicamentService;
  }

  @GetMapping
  public List<Medicament> getAll() {
    return medicamentService.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Medicament> getById(@PathVariable Long id) {
    return medicamentService.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public Medicament create(@RequestBody Medicament medicament) {
    return medicamentService.save(medicament);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Medicament> update(@PathVariable Long id, @RequestBody Medicament medicament) {
    return medicamentService.getById(id)
      .map(existing -> {
        medicament.setId(existing.getId());
        return ResponseEntity.ok(medicamentService.save(medicament));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    medicamentService.delete(id);
    return ResponseEntity.noContent().build();
  }
}

