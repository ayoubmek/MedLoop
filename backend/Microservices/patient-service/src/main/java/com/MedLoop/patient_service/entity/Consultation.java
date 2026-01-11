package com.MedLoop.patient_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "consultations")
public class Consultation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private LocalDateTime dateConsultation;
  private String description;
  private String diagnostic;
  private String motifConsultation;
  private Long doctorId;
  private String doctorName;
  @ManyToOne
  @JoinColumn(name = "patient_id")
  @JsonBackReference
  private Patient patient;
}

