package com.MedLoop.patient_service.dto;

import java.time.LocalDateTime;

public record ConsultationDTO(
  Long id,
  LocalDateTime dateConsultation,
  String description,
  String diagnostic,
  String motifConsultation,
  Long doctorId,
  String doctorName,
  Long patientId
) {}
