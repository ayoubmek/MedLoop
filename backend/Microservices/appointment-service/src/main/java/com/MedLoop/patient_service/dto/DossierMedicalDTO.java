package com.MedLoop.patient_service.dto;

import java.util.List;

public record DossierMedicalDTO(
  Long id,
  String type,
  String notes,
  Long patientId,
  List<OrdonnanceDTO> ordonnances,
  List<ResultatExamenDTO> resultatsExamens,
  List<DocumentDTO> documents,
  List<AnalysePredictiveDTO> analyses
) {}
