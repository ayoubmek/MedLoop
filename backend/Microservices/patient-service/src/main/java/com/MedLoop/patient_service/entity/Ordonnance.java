package com.MedLoop.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ordonnances")
public class Ordonnance {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private LocalDate dateCreation;

  @Column(length = 1000)
  private String noteMedecin;

  private String doctorName;

  @ManyToOne
  @JoinColumn(name = "dossier_id")
  private DossierMedical dossier;

  @OneToMany(mappedBy = "ordonnance", cascade = CascadeType.ALL)
  private List<Medicament> medicaments;

}
