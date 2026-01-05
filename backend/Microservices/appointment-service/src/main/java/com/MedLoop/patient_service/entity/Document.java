package com.MedLoop.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "documents")
public class Document {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nom;
  private String type;
  private String cheminUpload;

  @Temporal(TemporalType.DATE)
  private Date dateUpload;

  private boolean accesConfirmePatient;

  @ManyToOne
  @JoinColumn(name = "dossier_id")
  private DossierMedical dossier;
}
