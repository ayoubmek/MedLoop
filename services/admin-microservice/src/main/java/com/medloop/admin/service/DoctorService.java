package com.medloop.admin.service;

import com.medloop.admin.client.HospitalServiceClient;
import com.medloop.admin.dto.DoctorDTO;
import com.medloop.admin.entity.Doctor;
import com.medloop.admin.entity.Hospital;
import com.medloop.admin.exception.ResourceNotFoundException;
import com.medloop.admin.exception.DuplicateResourceException;
import com.medloop.admin.repository.DoctorRepository;
import com.medloop.admin.repository.HospitalRepository;
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
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final HospitalServiceClient hospitalServiceClient;

    public List<DoctorDTO> getAllDoctors() {
        log.info("Fetching all doctors");
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        log.info("Fetching doctor with id: {}", id);
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return convertToDTO(doctor);
    }

    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        log.info("Creating new doctor: {}", doctorDTO.getName());

        if (doctorRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new DuplicateResourceException("Doctor with email " + doctorDTO.getEmail() + " already exists");
        }

        if (doctorRepository.existsByLicenseNumber(doctorDTO.getLicenseNumber())) {
            throw new DuplicateResourceException("Doctor with license number " + doctorDTO.getLicenseNumber() + " already exists");
        }

        Doctor doctor = convertToEntity(doctorDTO);

        if (doctorDTO.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(doctorDTO.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + doctorDTO.getHospitalId()));
            doctor.setHospital(hospital);
        }

        Doctor savedDoctor = doctorRepository.save(doctor);
        log.info("Doctor created with id: {}", savedDoctor.getId());
        
        // Sync to hospital service
        DoctorDTO savedDoctorDTO = convertToDTO(savedDoctor);
        hospitalServiceClient.createMedecinFromDoctor(savedDoctorDTO);
        
        return savedDoctorDTO;
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {
        log.info("Updating doctor with id: {}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        // Check email uniqueness if changed
        if (!doctor.getEmail().equals(doctorDTO.getEmail()) &&
                doctorRepository.existsByEmail(doctorDTO.getEmail())) {
            throw new DuplicateResourceException("Doctor with email " + doctorDTO.getEmail() + " already exists");
        }

        // Check license number uniqueness if changed
        if (!doctor.getLicenseNumber().equals(doctorDTO.getLicenseNumber()) &&
                doctorRepository.existsByLicenseNumber(doctorDTO.getLicenseNumber())) {
            throw new DuplicateResourceException("Doctor with license number " + doctorDTO.getLicenseNumber() + " already exists");
        }

        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setLicenseNumber(doctorDTO.getLicenseNumber());
        doctor.setPhone(doctorDTO.getPhone());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setIsActive(doctorDTO.getIsActive() != null ? doctorDTO.getIsActive() : true);

        if (doctorDTO.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(doctorDTO.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + doctorDTO.getHospitalId()));
            doctor.setHospital(hospital);
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("Doctor updated successfully");
        
        // Sync to hospital service
        DoctorDTO updatedDoctorDTO = convertToDTO(updatedDoctor);
        hospitalServiceClient.updateMedecinFromDoctor(id, updatedDoctorDTO);
        
        return updatedDoctorDTO;
    }

    public void deleteDoctor(Long id) {
        log.info("Deleting doctor with id: {}", id);

        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }

        // Get doctor info before deletion for sync
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        String doctorName = doctor.getName();

        doctorRepository.deleteById(id);
        log.info("Doctor deleted successfully");
        
        // Sync deletion to hospital service
        hospitalServiceClient.deleteMedecinFromDoctor(id, doctorName);
    }

    public List<DoctorDTO> getDoctorsByHospital(Long hospitalId) {
        log.info("Fetching doctors by hospital id: {}", hospitalId);
        return doctorRepository.findByHospital_Id(hospitalId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void assignDoctorToHospital(Long doctorId, Long hospitalId) {
        log.info("Assigning doctor {} to hospital {}", doctorId, hospitalId);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + hospitalId));

        doctor.setHospital(hospital);
        doctorRepository.save(doctor);
        log.info("Doctor assigned to hospital successfully");
    }

    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        log.info("Fetching doctors by specialization: {}", specialization);
        return doctorRepository.findBySpecializationIgnoreCase(specialization).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllSpecializations() {
        log.info("Fetching all specializations");
        return doctorRepository.findAllSpecializations();
    }

    public List<DoctorDTO> searchDoctors(String name) {
        log.info("Searching doctors by name: {}", name);
        return doctorRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .licenseNumber(doctor.getLicenseNumber())
                .phone(doctor.getPhone())
                .email(doctor.getEmail())
                .hospitalId(doctor.getHospitalId())
                .hospitalName(doctor.getHospitalName())
                .isActive(doctor.getIsActive())
                .build();
    }

    private Doctor convertToEntity(DoctorDTO dto) {
        return Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .licenseNumber(dto.getLicenseNumber())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
    }
}
