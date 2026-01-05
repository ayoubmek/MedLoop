package com.MedLoop.patient_service.dto;


public record MedicamentDTO(
  Long id,
  String nom,
  String dosage
) {}
