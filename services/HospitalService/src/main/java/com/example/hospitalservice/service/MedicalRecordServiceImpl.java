package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.MedicalRecordRepository;
import com.example.hospitalservice.entities.MedicalRecord;
import com.example.hospitalservice.entities.Patient;
import com.example.hospitalservice.entities.Medecin;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientService patientService;
    private final MedecinService medecinService;

    @Override
    public MedicalRecord createRecord(MedicalRecord record) {
        log.info("Creating medical record for patient: {}", record.getPatient() != null ? record.getPatient().getId() : null);

        if (record.getPatient() != null && record.getPatient().getId() != null) {
            Patient p = patientService.getPatientById(record.getPatient().getId());
            record.setPatient(p);
        }

        if (record.getMedecin() != null && record.getMedecin().getId() != null) {
            Medecin m = medecinService.getMedecinById(record.getMedecin().getId());
            record.setMedecin(m);
        }

        return medicalRecordRepository.save(record);
    }

    @Override
    public MedicalRecord updateRecord(Long id, MedicalRecord record) {
        MedicalRecord existing = getRecordById(id);
        existing.setSummary(record.getSummary());
        existing.setDiagnosis(record.getDiagnosis());
        existing.setNotes(record.getNotes());
        existing.setPrescriptions(record.getPrescriptions());
        return medicalRecordRepository.save(existing);
    }

    @Override
    public void deleteRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new RuntimeException("Medical record not found: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }

    @Override
    public MedicalRecord getRecordById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found: " + id));
    }

    @Override
    public List<MedicalRecord> getRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatient_Id(patientId);
    }
}
