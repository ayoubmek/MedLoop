package com.MedLoop.patient_service.dto;

public record PatientDTO(
  Long id,
  String nom,
  String prenom,
  String cin,
  String telephone,
  String image
) {}
