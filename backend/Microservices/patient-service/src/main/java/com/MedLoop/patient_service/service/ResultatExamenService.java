package com.MedLoop.patient_service.service;
import com.MedLoop.patient_service.entity.ResultatExamen;
import com.MedLoop.patient_service.repository.ResultatExamenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResultatExamenService {

  private final ResultatExamenRepository repository;

  public ResultatExamenService(ResultatExamenRepository repository) {
    this.repository = repository;
  }

  public List<ResultatExamen> getAll() {
    return repository.findAll();
  }

  public Optional<ResultatExamen> getById(Long id) {
    return repository.findById(id);
  }

  public List<ResultatExamen> getByDossierId(Long dossierId) {
    return repository.findByDossierId(dossierId);
  }

  public ResultatExamen save(ResultatExamen resultat) {
    return repository.save(resultat);
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }
}
