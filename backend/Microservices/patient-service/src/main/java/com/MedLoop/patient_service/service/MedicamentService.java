package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.Medicament;
import com.MedLoop.patient_service.repository.MedicamentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicamentService {

  private final MedicamentRepository medicamentRepository;

  public MedicamentService(MedicamentRepository medicamentRepository) {
    this.medicamentRepository = medicamentRepository;
  }

  public List<Medicament> getAll() {
    return medicamentRepository.findAll();
  }

  public Optional<Medicament> getById(Long id) {
    return medicamentRepository.findById(id);
  }

  public Medicament save(Medicament medicament) {
    return medicamentRepository.save(medicament);
  }

  public void delete(Long id) {
    medicamentRepository.deleteById(id);
  }
}
