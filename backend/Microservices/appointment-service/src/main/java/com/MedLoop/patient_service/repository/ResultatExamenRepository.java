package com.MedLoop.patient_service.repository;

import com.MedLoop.patient_service.entity.ResultatExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultatExamenRepository extends JpaRepository<ResultatExamen, Long> {
  List<ResultatExamen> findByDossierId(Long dossierId);
}
