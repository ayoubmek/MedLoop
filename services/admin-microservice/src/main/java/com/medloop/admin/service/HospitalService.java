package com.medloop.admin.service;

import com.medloop.admin.dto.HospitalDTO;
import com.medloop.admin.entity.Hospital;
import com.medloop.admin.exception.ResourceNotFoundException;
import com.medloop.admin.exception.DuplicateResourceException;
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
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public List<HospitalDTO> getAllHospitals() {
        log.info("Fetching all hospitals");
        return hospitalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HospitalDTO getHospitalById(Long id) {
        log.info("Fetching hospital with id: {}", id);
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return convertToDTO(hospital);
    }

    public HospitalDTO createHospital(HospitalDTO hospitalDTO) {
        log.info("Creating new hospital: {}", hospitalDTO.getName());

        if (hospitalRepository.existsByEmail(hospitalDTO.getEmail())) {
            throw new DuplicateResourceException("Hospital with email " + hospitalDTO.getEmail() + " already exists");
        }

        Hospital hospital = convertToEntity(hospitalDTO);
        Hospital savedHospital = hospitalRepository.save(hospital);
        log.info("Hospital created with id: {}", savedHospital.getId());
        return convertToDTO(savedHospital);
    }

    public HospitalDTO updateHospital(Long id, HospitalDTO hospitalDTO) {
        log.info("Updating hospital with id: {}", id);

        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));

        // Check email uniqueness if changed
        if (!hospital.getEmail().equals(hospitalDTO.getEmail()) &&
                hospitalRepository.existsByEmail(hospitalDTO.getEmail())) {
            throw new DuplicateResourceException("Hospital with email " + hospitalDTO.getEmail() + " already exists");
        }

        hospital.setName(hospitalDTO.getName());
        hospital.setAddress(hospitalDTO.getAddress());
        hospital.setPhone(hospitalDTO.getPhone());
        hospital.setEmail(hospitalDTO.getEmail());
        hospital.setTotalBeds(hospitalDTO.getTotalBeds());
        hospital.setAvailableBeds(hospitalDTO.getAvailableBeds());

        Hospital updatedHospital = hospitalRepository.save(hospital);
        log.info("Hospital updated successfully");
        return convertToDTO(updatedHospital);
    }

    public void deleteHospital(Long id) {
        log.info("Deleting hospital with id: {}", id);

        if (!hospitalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hospital not found with id: " + id);
        }

        hospitalRepository.deleteById(id);
        log.info("Hospital deleted successfully");
    }

    public List<HospitalDTO> searchHospitals(String name) {
        log.info("Searching hospitals by name: {}", name);
        return hospitalRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HospitalDTO> getHospitalsWithAvailableBeds() {
        log.info("Fetching hospitals with available beds");
        return hospitalRepository.findHospitalsWithAvailableBeds().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private HospitalDTO convertToDTO(Hospital hospital) {
        return HospitalDTO.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .address(hospital.getAddress())
                .phone(hospital.getPhone())
                .email(hospital.getEmail())
                .totalBeds(hospital.getTotalBeds())
                .availableBeds(hospital.getAvailableBeds())
                .totalDoctors(hospital.getTotalDoctors())
                .build();
    }

    private Hospital convertToEntity(HospitalDTO dto) {
        return Hospital.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .totalBeds(dto.getTotalBeds())
                .availableBeds(dto.getAvailableBeds())
                .build();
    }
}
