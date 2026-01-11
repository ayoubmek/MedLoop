package com.MedLoop.patient_service.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultatExamen {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String typeExamen;
  private String resultat;
  private LocalDate dateExamen;

  @ManyToOne
  @JoinColumn(name = "dossier_id")
  private DossierMedical dossier;
}

