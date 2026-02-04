package com.medloop.admin.repository;

import com.medloop.admin.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByKeycloakUserId(String keycloakUserId);

    boolean existsByEmail(String email);

    List<Patient> findByDoctor_Id(Long doctorId);

    List<Patient> findByIsActiveTrue();

    @Query("SELECT p FROM Patient p WHERE p.doctor IS NULL")
    List<Patient> findPatientsWithoutDoctor();

    List<Patient> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Patient p WHERE p.dateOfBirth BETWEEN :startDate AND :endDate")
    List<Patient> findByDateOfBirthBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Patient p WHERE p.bloodGroup = :bloodGroup")
    List<Patient> findByBloodGroup(@Param("bloodGroup") String bloodGroup);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.doctor.id = :doctorId")
    long countByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.doctor.hospital.id = :hospitalId")
    long countByHospitalId(@Param("hospitalId") Long hospitalId);
}
