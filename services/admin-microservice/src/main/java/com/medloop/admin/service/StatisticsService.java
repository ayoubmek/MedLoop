package com.medloop.admin.service;

import com.medloop.admin.dto.StatisticsDTO;
import com.medloop.admin.entity.Hospital;
import com.medloop.admin.repository.DoctorRepository;
import com.medloop.admin.repository.HospitalRepository;
import com.medloop.admin.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsService {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public StatisticsDTO getStatistics() {
        log.info("Calculating system statistics");

        long totalHospitals = hospitalRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalPatients = patientRepository.count();
        long activeDoctors = doctorRepository.findByIsActiveTrue().size();
        long activePatients = patientRepository.findByIsActiveTrue().size();

        List<Hospital> hospitals = hospitalRepository.findAll();
        long totalBeds = hospitals.stream()
                .mapToLong(h -> h.getTotalBeds() != null ? h.getTotalBeds() : 0)
                .sum();
        long availableBeds = hospitals.stream()
                .mapToLong(h -> h.getAvailableBeds() != null ? h.getAvailableBeds() : 0)
                .sum();

        double bedOccupancyRate = totalBeds > 0
                ? ((double) (totalBeds - availableBeds) / totalBeds) * 100
                : 0.0;

        return StatisticsDTO.builder()
                .totalHospitals(totalHospitals)
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .activeDoctors(activeDoctors)
                .activePatients(activePatients)
                .totalBeds(totalBeds)
                .availableBeds(availableBeds)
                .bedOccupancyRate(Math.round(bedOccupancyRate * 100.0) / 100.0)
                .build();
    }
}
