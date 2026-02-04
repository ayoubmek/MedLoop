package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Medecin;
import com.example.hospitalservice.service.MedecinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
@RequiredArgsConstructor
public class MedecinController {

    private final MedecinService medecinService;

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
}
