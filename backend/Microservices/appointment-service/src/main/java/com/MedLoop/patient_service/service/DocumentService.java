package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.Document;
import com.MedLoop.patient_service.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

  private final DocumentRepository repository;

  public DocumentService(DocumentRepository repository) {
    this.repository = repository;
  }

  public List<Document> getAll() {
    return repository.findAll();
  }

  public Optional<Document> getById(Long id) {
    return repository.findById(id);
  }

  public List<Document> getByDossierId(Long dossierId) {
    return repository.findByDossierId(dossierId);
  }

  public Document save(Document document) {
    return repository.save(document);
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }
}
