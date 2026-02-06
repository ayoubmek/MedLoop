package com.example.hospitalservice.service;

import com.example.hospitalservice.entities.MedicalRecord;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecord createRecord(MedicalRecord record);
    MedicalRecord updateRecord(Long id, MedicalRecord record);
    void deleteRecord(Long id);
    MedicalRecord getRecordById(Long id);
    List<MedicalRecord> getRecordsByPatient(Long patientId);
}
