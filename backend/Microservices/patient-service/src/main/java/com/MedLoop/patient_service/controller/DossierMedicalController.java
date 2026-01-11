package com.MedLoop.patient_service.controller;
import com.MedLoop.patient_service.dto.*;
import com.MedLoop.patient_service.entity.*;
import com.MedLoop.patient_service.service.DossierMedicalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dossiers")
@CrossOrigin(origins = "*")
public class DossierMedicalController {
  private final DossierMedicalService dossierService;

  public DossierMedicalController(DossierMedicalService dossierService) {
    this.dossierService = dossierService;
  }
  private DossierMedicalDTO toDTO(DossierMedical d) {

    List<OrdonnanceDTO> ordonnancesDTO =
      (d.getOrdonnances() == null) ? List.of() :
        d.getOrdonnances().stream()
          .map(o -> new OrdonnanceDTO(
            o.getId(),
            o.getDateCreation(),
            o.getNoteMedecin(),
            o.getDoctorName(),
            (o.getMedicaments() == null) ? List.of() :
              o.getMedicaments().stream()
                .map(m -> new MedicamentDTO(
                  m.getId(),
                  m.getNom(),
                  m.getDosage()
                ))
                .collect(Collectors.toList())
          ))
          .collect(Collectors.toList());


    List<DocumentDTO> documentsDTO =
      (d.getDocuments() == null) ? List.of() :
        d.getDocuments().stream()
          .map(doc -> new DocumentDTO(
            doc.getId(),
            doc.getNom(),
            doc.getType(),
            doc.getCheminUpload(),
            doc.getDateUpload(),
            doc.isAccesConfirmePatient()
          ))
          .collect(Collectors.toList());

    List<ResultatExamenDTO> resultatsDTO =
      (d.getResultatsExamens() == null) ? List.of() :
        d.getResultatsExamens().stream()
          .map(r -> new ResultatExamenDTO(
            r.getId(),
            r.getTypeExamen(),
            r.getResultat(),
            r.getDateExamen(),
            (r.getDossier() != null ? r.getDossier().getId() : null)
          ))
          .collect(Collectors.toList());

    List<AnalysePredictiveDTO> analysesDTO =
      (d.getAnalyses() == null) ? List.of() :
        d.getAnalyses().stream()
          .map(a -> new AnalysePredictiveDTO(
            a.getId(),
            a.getType(),
            a.getResultat()
          ))
          .collect(Collectors.toList());

    Long patientId = (d.getPatient() != null) ? d.getPatient().getId() : null;

    return new DossierMedicalDTO(
      d.getId(),
      d.getType(),
      d.getNotes(),
      patientId,
      ordonnancesDTO,
      resultatsDTO,
      documentsDTO,
      analysesDTO
    );
  }

  @GetMapping
  public List<DossierMedicalDTO> getAll() {
    return dossierService.getAll()
      .stream()
      .map(this::toDTO)
      .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<DossierMedicalDTO> getById(@PathVariable Long id) {
    return dossierService.getById(id)
      .map(d -> ResponseEntity.ok(toDTO(d)))
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/patient/{patientId}")
  public List<DossierMedicalDTO> getByPatient(@PathVariable Long patientId) {
    return dossierService.getByPatientId(patientId)
      .stream()
      .map(this::toDTO)
      .collect(Collectors.toList());
  }

  @PostMapping
  public DossierMedicalDTO create(@RequestBody DossierMedical dossier) {
    return toDTO(dossierService.save(dossier));
  }

  @PutMapping("/{id}")
  public ResponseEntity<DossierMedicalDTO> update(
    @PathVariable Long id,
    @RequestBody DossierMedical dossier
  ) {
    return dossierService.getById(id)
      .map(existing -> {
        dossier.setId(existing.getId());
        return ResponseEntity.ok(toDTO(dossierService.save(dossier)));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    dossierService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
