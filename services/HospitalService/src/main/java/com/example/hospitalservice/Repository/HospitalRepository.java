package com.example.hospitalservice.Repository;

import com.example.hospitalservice.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    // Pour trouver l'hôpital d'un service spécifique
    @Query("SELECT h FROM Hospital h JOIN h.services s WHERE s.id = :serviceId")
    List<Hospital> findHospitalsByServiceId(@Param("serviceId") Long serviceId);
}
