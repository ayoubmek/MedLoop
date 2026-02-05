package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Patient;
import com.example.hospitalservice.entities.Medecin;
import com.example.hospitalservice.entities.MedicalService;
import com.example.hospitalservice.service.AppointmentService;
import com.example.hospitalservice.service.PatientService;
import com.example.hospitalservice.service.MedecinService;
import com.example.hospitalservice.service.MedicalServiceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final PatientService patientService;
    private final MedecinService medecinService;
    private final MedicalServiceService medicalServiceService;

    public AppointmentController(AppointmentService appointmentService,
                                 PatientService patientService,
                                 MedecinService medecinService,
                                 MedicalServiceService medicalServiceService) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
        this.medecinService = medecinService;
        this.medicalServiceService = medicalServiceService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByService(@PathVariable Long serviceId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByService(serviceId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByHospital(@PathVariable Long hospitalId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByHospital(hospitalId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("=== DEBUT DEBUG CREATE APPOINTMENT ===");
            System.out.println("Payload reçu: " + payload);

            // Extraire les données du payload
            Long patientId = ((Number) payload.get("patientId")).longValue();
            Long doctorId = ((Number) payload.get("doctorId")).longValue();
            Integer duration = (Integer) payload.get("duration");
            String dateTimeStr = (String) payload.get("dateTime");
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);

            // Extraire l'ID du service
            Map<String, Object> serviceData = (Map<String, Object>) payload.get("service");
            Long serviceId = null;
            if (serviceData != null && serviceData.get("id") != null) {
                serviceId = ((Number) serviceData.get("id")).longValue();
            }

            Long bedId = payload.get("bedId") != null ?
                    ((Number) payload.get("bedId")).longValue() : null;

            System.out.println("Patient ID: " + patientId);
            System.out.println("Doctor ID: " + doctorId);
            System.out.println("Service ID: " + serviceId);
            System.out.println("DateTime: " + dateTime);
            System.out.println("Duration: " + duration);

            // Récupérer les objets Patient et Medecin
            Patient patient = patientService.getPatientById(patientId);
            Medecin medecin = medecinService.getMedecinById(doctorId);

            // Service is optional now
            MedicalService service = null;
            if (serviceId != null) {
                service = medicalServiceService.getServiceById(serviceId);
            }

            // Créer l'objet Appointment
            Appointment appointment = new Appointment();
            appointment.setPatient(patient);
            appointment.setMedecin(medecin);
            if (service != null) {
                appointment.setService(service);
            }
            appointment.setDateTime(dateTime);
            appointment.setDuration(duration);
            appointment.setBedId(bedId);

            Appointment created = appointmentService.createAppointment(appointment);

            System.out.println("Appointment créé avec succès - ID: " + created.getId());
            System.out.println("=== FIN DEBUG CREATE APPOINTMENT ===");

            return new ResponseEntity<>(created, HttpStatus.CREATED);

        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "type", e.getClass().getSimpleName()
            ));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            System.out.println("=== DEBUT DEBUG UPDATE APPOINTMENT ===");
            System.out.println("Payload reçu: " + payload);

            // Extraire les données du payload
            Long patientId = ((Number) payload.get("patientId")).longValue();
            Long doctorId = ((Number) payload.get("doctorId")).longValue();
            Integer duration = (Integer) payload.get("duration");
            String dateTimeStr = (String) payload.get("dateTime");
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr);
            String status = (String) payload.get("status");

            // Extraire l'ID du service
            Map<String, Object> serviceData = (Map<String, Object>) payload.get("service");
            Long serviceId = null;
            if (serviceData != null && serviceData.get("id") != null) {
                serviceId = ((Number) serviceData.get("id")).longValue();
            }

            Long bedId = payload.get("bedId") != null ?
                    ((Number) payload.get("bedId")).longValue() : null;

            // Récupérer les objets Patient et Medecin
            Patient patient = patientService.getPatientById(patientId);
            Medecin medecin = medecinService.getMedecinById(doctorId);

            // Service is optional now
            MedicalService service = null;
            if (serviceId != null) {
                service = medicalServiceService.getServiceById(serviceId);
            }

            // Créer l'objet Appointment
            Appointment appointment = new Appointment();
            appointment.setPatient(patient);
            appointment.setMedecin(medecin);
            if (service != null) {
                appointment.setService(service);
            }
            appointment.setDateTime(dateTime);
            appointment.setDuration(duration);
            appointment.setBedId(bedId);
            appointment.setStatus(com.example.hospitalservice.entities.AppointmentStatus.valueOf(status));

            Appointment updated = appointmentService.updateAppointment(id, appointment);

            System.out.println("Appointment mis à jour avec succès - ID: " + updated.getId());
            System.out.println("=== FIN DEBUG UPDATE APPOINTMENT ===");

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour de l'appointment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "type", e.getClass().getSimpleName()
            ));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            System.out.println("=== DEBUT DEBUG CANCEL APPOINTMENT ===");
            System.out.println("ID à annuler: " + id);

            appointmentService.cancelAppointment(id);

            System.out.println("Appointment annulé avec succès - ID: " + id);
            System.out.println("=== FIN DEBUG CANCEL APPOINTMENT ===");

            return ResponseEntity.ok(Map.of("message", "Rendez-vous annulé avec succès"));
        } catch (NoSuchElementException e) {
            System.err.println("Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Erreur lors de l'annulation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            System.out.println("=== DEBUT DEBUG DELETE APPOINTMENT ===");
            System.out.println("ID à supprimer: " + id);

            appointmentService.deleteAppointment(id);

            System.out.println("Appointment supprimé avec succès - ID: " + id);
            System.out.println("=== FIN DEBUG DELETE APPOINTMENT ===");

            return ResponseEntity.ok(Map.of("message", "Rendez-vous supprimé avec succès"));
        } catch (NoSuchElementException e) {
            System.err.println("Erreur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam Long serviceId,
            @RequestParam String date
    ) {
        LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
        return ResponseEntity.ok(appointmentService.getAvailableSlots(serviceId, dateTime));
    }
}