package com.MedLoop.patient_service.dto;

import java.time.LocalDate;
import java.util.List;

public record OrdonnanceDTO(
  Long id,
  LocalDate dateCreation,
  String noteMedecin,
  String doctorName,
  List<MedicamentDTO> medicaments
) {}
