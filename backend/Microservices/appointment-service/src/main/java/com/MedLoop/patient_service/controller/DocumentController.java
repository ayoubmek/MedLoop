package com.MedLoop.patient_service.controller;

import com.MedLoop.patient_service.entity.Document;
import com.MedLoop.patient_service.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

  private final DocumentService service;

  public DocumentController(DocumentService service) {
    this.service = service;
  }

  @GetMapping
  public List<Document> getAll() {
    return service.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Document> getById(@PathVariable Long id) {
    return service.getById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/dossier/{dossierId}")
  public List<Document> getByDossier(@PathVariable Long dossierId) {
    return service.getByDossierId(dossierId);
  }

  @PostMapping
  public Document create(@RequestBody Document document) {
    return service.save(document);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Document> update(@PathVariable Long id, @RequestBody Document document) {
    return service.getById(id)
      .map(existing -> {
        document.setId(existing.getId());
        return ResponseEntity.ok(service.save(document));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}

