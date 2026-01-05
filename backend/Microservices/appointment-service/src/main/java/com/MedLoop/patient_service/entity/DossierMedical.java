package com.MedLoop.patient_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierMedical {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String type;
  private String notes;

  @ManyToOne
  @JoinColumn(name = "patient_id")
  @JsonBackReference
  private Patient patient;

  @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL)
  private List<Ordonnance> ordonnances;

  @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL)
  private List<ResultatExamen> resultatsExamens;

  @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL)
  private List<Document> documents;

  @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL)
  private List<AnalysePredictive> analyses;
}
