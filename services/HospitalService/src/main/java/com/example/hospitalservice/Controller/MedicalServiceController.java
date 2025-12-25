package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.entities.MedicalService;
import com.example.hospitalservice.service.MedicalServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
public class MedicalServiceController {
    private final MedicalServiceService medicalServiceService;

    @Autowired
    public MedicalServiceController(MedicalServiceService medicalServiceService) {
        this.medicalServiceService = medicalServiceService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<MedicalService>> getAllServices() {
        return ResponseEntity.ok(medicalServiceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalService> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(medicalServiceService.getServiceById(id));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<MedicalService>> getServicesByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(medicalServiceService.getServicesByHospital(hospitalId));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createService(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("=== DEBUT DEBUG CREATE SERVICE ===");
            System.out.println("Payload reçu: " + payload);

            // Extraire les données du payload
            String name = (String) payload.get("name");
            String department = (String) payload.get("department");
            Integer totalBeds = (Integer) payload.get("totalBeds");
            Integer availableBeds = (Integer) payload.get("availableBeds");

            // Extraire l'ID de l'hôpital
            Map<String, Object> hospitalData = (Map<String, Object>) payload.get("hospital");
            Long hospitalId = null;
            if (hospitalData != null && hospitalData.get("id") != null) {
                hospitalId = ((Number) hospitalData.get("id")).longValue();
            }

            System.out.println("Name: " + name);
            System.out.println("Department: " + department);
            System.out.println("Hospital ID: " + hospitalId);
            System.out.println("Total Beds: " + totalBeds);
            System.out.println("Available Beds: " + availableBeds);

            // Créer l'objet MedicalService
            MedicalService service = new MedicalService();
            service.setName(name);
            service.setDepartment(department);
            service.setTotalBeds(totalBeds);
            service.setAvailableBeds(availableBeds);

            // Créer un objet Hospital avec juste l'ID
            Hospital hospital = new Hospital();
            hospital.setId(hospitalId);
            service.setHospital(hospital);

            MedicalService created = medicalServiceService.createService(service);

            System.out.println("Service créé avec succès - ID: " + created.getId());
            System.out.println("=== FIN DEBUG CREATE SERVICE ===");

            return new ResponseEntity<>(created, HttpStatus.CREATED);

        } catch (Exception e) {
            System.err.println("Erreur lors de la création du service: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "type", e.getClass().getSimpleName()
            ));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MedicalService> updateService(@PathVariable Long id, @Valid @RequestBody MedicalService serviceDetails) {
        return ResponseEntity.ok(medicalServiceService.updateService(id, serviceDetails));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        medicalServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/getAllWithHospitals")
    public ResponseEntity<List<MedicalService>> getAllServicesWithHospitals() {
        return ResponseEntity.ok(medicalServiceService.getAllServicesWithHospital());
    }
    // Dans MedicalServiceController.java
    @GetMapping("/{id}/hospital")
    public ResponseEntity<Hospital> getHospitalByService(@PathVariable Long id) {
        MedicalService service = medicalServiceService.getServiceById(id);
        Hospital hospital = service.getHospital(); // Récupère directement l'hôpital

        if (hospital == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(hospital);
    }
}
