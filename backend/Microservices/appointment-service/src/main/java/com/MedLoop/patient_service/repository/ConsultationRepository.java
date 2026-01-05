package com.MedLoop.patient_service.repository;
import com.MedLoop.patient_service.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
  List<Consultation> findByPatientId(Long patientId);
}
