package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.PatientRepository;
import com.example.hospitalservice.entities.Patient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public Patient savePatient(Patient patient) {
        log.info("Saving patient: {}", patient.getNom());
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        log.info("Fetching all patients");
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Long id) {
        log.info("Fetching patient with id: {}", id);
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    @Override
    public void deletePatient(Long id) {
        log.info("Deleting patient with id: {}", id);
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
        log.info("Patient deleted successfully");
    }

    @Override
    public Patient updatePatient(Long id, Patient patientDetails) {
        log.info("Updating patient with id: {}", id);

        Patient patient = getPatientById(id);

        patient.setNom(patientDetails.getNom());
        patient.setPrenom(patientDetails.getPrenom());
        patient.setEmail(patientDetails.getEmail());
        patient.setTelephone(patientDetails.getTelephone());
        patient.setDateNaissance(patientDetails.getDateNaissance());
        patient.setSexe(patientDetails.getSexe());
        patient.setAdresse(patientDetails.getAdresse());
        patient.setCodePostal(patientDetails.getCodePostal());
        patient.setVille(patientDetails.getVille());

        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getPatientsByDoctor(Long doctorId) {
        log.info("Fetching patients for doctor id: {}", doctorId);
        return patientRepository.findByDoctor_Id(doctorId);
    }

    @Override
    public List<Patient> searchPatients(String name) {
        log.info("Searching patients by name: {}", name);
        return patientRepository.findByNomContainingIgnoreCase(name);
    }
}
