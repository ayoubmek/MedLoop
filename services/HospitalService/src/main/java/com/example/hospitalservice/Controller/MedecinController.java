package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Medecin;
import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.service.MedecinService;
import com.example.hospitalservice.Repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
@RequiredArgsConstructor
@Slf4j
public class MedecinController {

    private final MedecinService medecinService;
    private final HospitalRepository hospitalRepository;

    // RDV du médecin
    @GetMapping("/{id}/appointments")
    public List<Appointment> getAppointmentsByMedecin(@PathVariable Long id) {
        return medecinService.getAppointmentsByMedecin(id);
    }

    // RDV du service du médecin
    @GetMapping("/{id}/service/appointments")
    public List<Appointment> getAppointmentsByService(@PathVariable Long id) {
        return medecinService.getAppointmentsByService(id);
    }
    @PostMapping("/create")
    public Medecin createMedecin(@RequestBody Medecin medecin) {
        return medecinService.saveMedecin(medecin);
    }

    @GetMapping
    public List<Medecin> getAllMedecins() {
        return medecinService.getAllMedecins();
    }

    @GetMapping("/{id}")
    public Medecin getMedecinById(@PathVariable Long id) {
        return medecinService.getMedecinById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteMedecin(@PathVariable Long id) {
        medecinService.deleteMedecin(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Medecin> updateMedecin(
            @PathVariable Long id,
            @RequestBody Medecin medecinDetails) {
        Medecin updatedMedecin = medecinService.updateMedecin(id, medecinDetails);
        return ResponseEntity.ok(updatedMedecin);
    }

    // ==================== SYNC ENDPOINTS ====================
    
    /**
     * Sync endpoint to create a medecin from admin service
     */
    @PostMapping("/sync/create")
    public ResponseEntity<Medecin> syncCreateMedecin(@RequestBody MedecinSyncRequest request) {
        try {
            log.info("Syncing medecin creation from admin service: {}", request.getNom());
            
            Medecin medecin = new Medecin();
            medecin.setNom(request.getNom());
            medecin.setPrenom(request.getPrenom());
            medecin.setSpecialite(request.getSpecialite());
            medecin.setNumeroOrdre(request.getNumeroOrdre());
            medecin.setTelephone(request.getTelephone());
            medecin.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
            
            // Set hospital if provided
            if (request.getHopitalId() != null) {
                Hospital hospital = hospitalRepository.findById(request.getHopitalId())
                        .orElse(null);
                if (hospital != null) {
                    medecin.setHopital(hospital);
                }
            }
            
            Medecin savedMedecin = medecinService.saveMedecin(medecin);
            log.info("Successfully synced medecin creation: {}", savedMedecin.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMedecin);
        } catch (Exception e) {
            log.error("Error syncing medecin creation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Sync endpoint to update a medecin from admin service
     */
    @PutMapping("/sync/update/{id}")
    public ResponseEntity<Medecin> syncUpdateMedecin(
            @PathVariable Long id,
            @RequestBody MedecinSyncRequest request) {
        try {
            log.info("Syncing medecin update from admin service for id: {}", id);
            
            Medecin medecin = medecinService.getMedecinById(id);
            medecin.setNom(request.getNom());
            medecin.setPrenom(request.getPrenom());
            medecin.setSpecialite(request.getSpecialite());
            medecin.setNumeroOrdre(request.getNumeroOrdre());
            medecin.setTelephone(request.getTelephone());
            medecin.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
            
            // Update hospital if provided
            if (request.getHopitalId() != null) {
                Hospital hospital = hospitalRepository.findById(request.getHopitalId())
                        .orElse(null);
                if (hospital != null) {
                    medecin.setHopital(hospital);
                }
            }
            
            Medecin updatedMedecin = medecinService.updateMedecin(id, medecin);
            log.info("Successfully synced medecin update for id: {}", id);
            return ResponseEntity.ok(updatedMedecin);
        } catch (Exception e) {
            log.error("Error syncing medecin update", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Sync endpoint to delete a medecin from admin service
     */
    @DeleteMapping("/sync/delete/{id}")
    public ResponseEntity<Void> syncDeleteMedecin(@PathVariable Long id) {
        try {
            log.info("Syncing medecin deletion from admin service for id: {}", id);
            
            // Check if medecin exists
            try {
                medecinService.getMedecinById(id);
            } catch (Exception e) {
                log.warn("Medecin not found for sync deletion, id: {}", id);
                return ResponseEntity.ok().build(); // Already deleted or never existed
            }
            
            medecinService.deleteMedecin(id);
            log.info("Successfully synced medecin deletion for id: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error syncing medecin deletion", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

