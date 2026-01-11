package com.MedLoop.patient_service.dto;

import java.util.Date;

public record DocumentDTO(
  Long id,
  String nom,
  String type,
  String cheminUpload,
  Date dateUpload,
  boolean accesConfirmePatient
) {}
