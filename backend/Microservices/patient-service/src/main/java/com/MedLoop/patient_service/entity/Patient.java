package com.MedLoop.patient_service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nom;
  private String prenom;
  private String cin;
  private String telephone;
  private String image;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Consultation> consultations;

  @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<DossierMedical> dossiers;
}
