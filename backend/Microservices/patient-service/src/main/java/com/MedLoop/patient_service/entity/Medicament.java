package com.MedLoop.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "medicaments")
public class Medicament {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nom;

  private String dosage;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ordonnance_id", nullable = false)
  private Ordonnance ordonnance;
}
