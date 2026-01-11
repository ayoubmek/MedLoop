package com.MedLoop.patient_service.dto;


import java.time.LocalDate;

public record ResultatExamenDTO(
  Long id,
  String typeExamen,
  String resultat,
  LocalDate dateExamen,
  Long dossierId
) {}
