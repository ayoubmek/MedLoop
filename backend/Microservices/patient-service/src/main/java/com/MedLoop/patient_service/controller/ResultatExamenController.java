package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.ResultatExamen;
import com.MedLoop.patient_service.service.ResultatExamenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultats")
public class ResultatExamenController {

  private final ResultatExamenService service;

  public ResultatExamenController(ResultatExamenService service) {
    this.service = service;
  }

  @GetMapping
  public List<ResultatExamen> getAll() {
    return service.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResultatExamen> getById(@PathVariable Long id) {
    return service.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/dossier/{dossierId}")
  public List<ResultatExamen> getByDossier(@PathVariable Long dossierId) {
    return service.getByDossierId(dossierId);
  }

  @PostMapping
  public ResultatExamen create(@RequestBody ResultatExamen resultat) {
    return service.save(resultat);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ResultatExamen> update(@PathVariable Long id, @RequestBody ResultatExamen resultat) {
    return service.getById(id)
      .map(existing -> {
        resultat.setId(existing.getId());
        return ResponseEntity.ok(service.save(resultat));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
