package com.example.hospitalservice.Repository;

import com.example.hospitalservice.entities.MedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    List<MedicalService> findByHospitalId(Long hospitalId);
    boolean existsByNameAndHospitalId(String name, Long hospitalId);
}
