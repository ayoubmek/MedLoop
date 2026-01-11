package com.MedLoop.patient_service.repository;

import com.MedLoop.patient_service.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
  List<Document> findByDossierId(Long dossierId);
}
