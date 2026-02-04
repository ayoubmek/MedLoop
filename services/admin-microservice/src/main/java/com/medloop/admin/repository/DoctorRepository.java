package com.medloop.admin.repository;

import com.medloop.admin.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByLicenseNumber(String licenseNumber);

    Optional<Doctor> findByKeycloakUserId(String keycloakUserId);

    boolean existsByEmail(String email);

    boolean existsByLicenseNumber(String licenseNumber);

    List<Doctor> findByHospital_Id(Long hospitalId);

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    List<Doctor> findByIsActiveTrue();

    @Query("SELECT d FROM Doctor d WHERE d.hospital IS NULL")
    List<Doctor> findDoctorsWithoutHospital();

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.patients WHERE d.id = :id")
    Optional<Doctor> findByIdWithPatients(@Param("id") Long id);

    List<Doctor> findByNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.specialization IS NOT NULL")
    List<String> findAllSpecializations();

    @Query("SELECT COUNT(d) FROM Doctor d WHERE d.hospital.id = :hospitalId")
    long countByHospitalId(@Param("hospitalId") Long hospitalId);
}
