package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.Ordonnance;
import com.MedLoop.patient_service.repository.OrdonnanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdonnanceService {

  private final OrdonnanceRepository ordonnanceRepository;

  public OrdonnanceService(OrdonnanceRepository ordonnanceRepository) {
    this.ordonnanceRepository = ordonnanceRepository;
  }

  public List<Ordonnance> getAll() {
    return ordonnanceRepository.findAll();
  }

  public Optional<Ordonnance> getById(Long id) {
    return ordonnanceRepository.findById(id);
  }

  public List<Ordonnance> getByDossierId(Long dossierId) {
    return ordonnanceRepository.findByDossierId(dossierId);
  }

  public Ordonnance save(Ordonnance ordonnance) {
    return ordonnanceRepository.save(ordonnance);
  }

  public void delete(Long id) {
    ordonnanceRepository.deleteById(id);
  }
}
