package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.MedicalRecord;
import com.example.hospitalservice.entities.Patient;
import com.example.hospitalservice.entities.Medecin;
import com.example.hospitalservice.service.MedicalRecordService;
import com.example.hospitalservice.service.PatientService;
import com.example.hospitalservice.service.MedecinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicalRecords")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final PatientService patientService;
    private final MedecinService medecinService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getById(@PathVariable Long id) {
        return ResponseEntity.ok(medicalRecordService.getRecordById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            // Extract patientId from payload
            Long patientId = payload.get("patientId") != null ? 
                ((Number) payload.get("patientId")).longValue() : null;
            
            if (patientId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "patientId is required"));
            }

            // Fetch patient and create record
            Patient patient = patientService.getPatientById(patientId);
            
            MedicalRecord record = new MedicalRecord();
            record.setPatient(patient);
            record.setSummary((String) payload.get("summary"));
            record.setDiagnosis((String) payload.get("diagnosis"));
            record.setNotes((String) payload.get("notes"));
            record.setPrescriptions((String) payload.get("prescriptions"));
            
            // Optional: set doctor if provided
            Long doctorId = payload.get("doctorId") != null ? 
                ((Number) payload.get("doctorId")).longValue() : null;
            if (doctorId != null) {
                Medecin medecin = medecinService.getMedecinById(doctorId);
                record.setMedecin(medecin);
            }
            
            return ResponseEntity.ok(medicalRecordService.createRecord(record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MedicalRecord> update(@PathVariable Long id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.updateRecord(id, record));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        medicalRecordService.deleteRecord(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
