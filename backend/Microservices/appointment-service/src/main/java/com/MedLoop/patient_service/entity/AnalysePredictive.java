package com.MedLoop.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysePredictive {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String type;
  private String resultat;

  @ManyToOne
  @JoinColumn(name = "dossier_id")
  private DossierMedical dossier;
}
