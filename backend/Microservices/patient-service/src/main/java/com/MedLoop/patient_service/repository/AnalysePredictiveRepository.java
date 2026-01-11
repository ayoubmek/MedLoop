package com.MedLoop.patient_service.repository;

import com.MedLoop.patient_service.entity.AnalysePredictive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysePredictiveRepository extends JpaRepository<AnalysePredictive, Long> {
  List<AnalysePredictive> findByDossierId(Long dossierId);
}
