package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.AnalysePredictive;
import com.MedLoop.patient_service.repository.AnalysePredictiveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalysePredictiveService {

  private final AnalysePredictiveRepository repository;

  public AnalysePredictiveService(AnalysePredictiveRepository repository) {
    this.repository = repository;
  }

  public List<AnalysePredictive> getAll() {
    return repository.findAll();
  }

  public Optional<AnalysePredictive> getById(Long id) {
    return repository.findById(id);
  }

  public List<AnalysePredictive> getByDossierId(Long dossierId) {
    return repository.findByDossierId(dossierId);
  }

  public AnalysePredictive save(AnalysePredictive analyse) {
    return repository.save(analyse);
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }
}
