package com.medloop.admin.service;

import com.medloop.admin.dto.PatientDTO;
import com.medloop.admin.entity.Doctor;
import com.medloop.admin.entity.Patient;
import com.medloop.admin.exception.ResourceNotFoundException;
import com.medloop.admin.exception.DuplicateResourceException;
import com.medloop.admin.repository.DoctorRepository;
import com.medloop.admin.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<PatientDTO> getAllPatients() {
        log.info("Fetching all patients");
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        log.info("Fetching patient with id: {}", id);
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return convertToDTO(patient);
    }

    public PatientDTO createPatient(PatientDTO patientDTO) {
        log.info("Creating new patient: {}", patientDTO.getName());

        if (patientRepository.existsByEmail(patientDTO.getEmail())) {
            throw new DuplicateResourceException("Patient with email " + patientDTO.getEmail() + " already exists");
        }

        Patient patient = convertToEntity(patientDTO);

        if (patientDTO.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(patientDTO.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + patientDTO.getDoctorId()));
            patient.setDoctor(doctor);
        }

        Patient savedPatient = patientRepository.save(patient);
        log.info("Patient created with id: {}", savedPatient.getId());
        return convertToDTO(savedPatient);
    }

    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        log.info("Updating patient with id: {}", id);

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        // Check email uniqueness if changed
        if (!patient.getEmail().equals(patientDTO.getEmail()) &&
                patientRepository.existsByEmail(patientDTO.getEmail())) {
            throw new DuplicateResourceException("Patient with email " + patientDTO.getEmail() + " already exists");
        }

        patient.setName(patientDTO.getName());
        patient.setDateOfBirth(patientDTO.getDateOfBirth());
        patient.setAddress(patientDTO.getAddress());
        patient.setPhone(patientDTO.getPhone());
        patient.setEmail(patientDTO.getEmail());
        patient.setBloodGroup(patientDTO.getBloodGroup());
        patient.setEmergencyContact(patientDTO.getEmergencyContact());
        patient.setMedicalHistory(patientDTO.getMedicalHistory());
        patient.setAllergies(patientDTO.getAllergies());
        patient.setIsActive(patientDTO.getIsActive() != null ? patientDTO.getIsActive() : true);

        if (patientDTO.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(patientDTO.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + patientDTO.getDoctorId()));
            patient.setDoctor(doctor);
        }

        Patient updatedPatient = patientRepository.save(patient);
        log.info("Patient updated successfully");
        return convertToDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        log.info("Deleting patient with id: {}", id);

        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }

        patientRepository.deleteById(id);
        log.info("Patient deleted successfully");
    }

    public List<PatientDTO> getPatientsByDoctor(Long doctorId) {
        log.info("Fetching patients by doctor id: {}", doctorId);
        return patientRepository.findByDoctor_Id(doctorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void assignPatientToDoctor(Long patientId, Long doctorId) {
        log.info("Assigning patient {} to doctor {}", patientId, doctorId);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        patient.setDoctor(doctor);
        patientRepository.save(patient);
        log.info("Patient assigned to doctor successfully");
    }

    public List<PatientDTO> searchPatients(String name) {
        log.info("Searching patients by name: {}", name);
        return patientRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PatientDTO> getPatientsByBloodGroup(String bloodGroup) {
        log.info("Fetching patients by blood group: {}", bloodGroup);
        return patientRepository.findByBloodGroup(bloodGroup).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .name(patient.getName())
                .dateOfBirth(patient.getDateOfBirth())
                .address(patient.getAddress())
                .phone(patient.getPhone())
                .email(patient.getEmail())
                .bloodGroup(patient.getBloodGroup())
                .emergencyContact(patient.getEmergencyContact())
                .medicalHistory(patient.getMedicalHistory())
                .allergies(patient.getAllergies())
                .doctorId(patient.getDoctorId())
                .doctorName(patient.getDoctorName())
                .isActive(patient.getIsActive())
                .build();
    }

    private Patient convertToEntity(PatientDTO dto) {
        return Patient.builder()
                .name(dto.getName())
                .dateOfBirth(dto.getDateOfBirth())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .bloodGroup(dto.getBloodGroup())
                .emergencyContact(dto.getEmergencyContact())
                .medicalHistory(dto.getMedicalHistory())
                .allergies(dto.getAllergies())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
    }
}
