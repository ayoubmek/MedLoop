package com.example.hospitalservice.service;

import com.example.hospitalservice.entities.Patient;

import java.util.List;

public interface PatientService {
    Patient savePatient(Patient patient);
    List<Patient> getAllPatients();
    Patient getPatientById(Long id);
    void deletePatient(Long id);
    Patient updatePatient(Long id, Patient patientDetails);
    List<Patient> getPatientsByDoctor(Long doctorId);
    List<Patient> searchPatients(String name);
}
