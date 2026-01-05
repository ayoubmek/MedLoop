package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.DossierMedical;
import com.MedLoop.patient_service.repository.DossierMedicalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DossierMedicalService {

  private final DossierMedicalRepository dossierRepository;

  public DossierMedicalService(DossierMedicalRepository dossierRepository) {
    this.dossierRepository = dossierRepository;
  }

  public List<DossierMedical> getAll() {
    return dossierRepository.findAll();
  }

  public Optional<DossierMedical> getById(Long id) {
    return dossierRepository.findById(id);
  }

  public List<DossierMedical> getByPatientId(Long patientId) {
    return dossierRepository.findByPatientId(patientId);
  }

  public DossierMedical save(DossierMedical dossier) {
    return dossierRepository.save(dossier);
  }

  public void delete(Long id) {
    dossierRepository.deleteById(id);
  }
}

