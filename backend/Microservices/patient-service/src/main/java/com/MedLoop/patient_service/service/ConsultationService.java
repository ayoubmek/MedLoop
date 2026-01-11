package com.MedLoop.patient_service.service;

import com.MedLoop.patient_service.entity.Consultation;
import com.MedLoop.patient_service.repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationService {

  private final ConsultationRepository consultationRepository;

  public ConsultationService(ConsultationRepository consultationRepository) {
    this.consultationRepository = consultationRepository;
  }

  public List<Consultation> getAll() {
    return consultationRepository.findAll();
  }

  public Optional<Consultation> getById(Long id) {
    return consultationRepository.findById(id);
  }

  public List<Consultation> getByPatientId(Long patientId) {
    return consultationRepository.findByPatientId(patientId);
  }

  public Consultation save(Consultation consultation) {
    return consultationRepository.save(consultation);
  }

  public void delete(Long id) {
    consultationRepository.deleteById(id);
  }
}
