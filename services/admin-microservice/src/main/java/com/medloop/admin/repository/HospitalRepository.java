package com.medloop.admin.repository;

import com.medloop.admin.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByEmail(String email);

    Optional<Hospital> findByName(String name);

    boolean existsByEmail(String email);

    boolean existsByName(String name);

    @Query("SELECT h FROM Hospital h WHERE h.availableBeds > 0")
    List<Hospital> findHospitalsWithAvailableBeds();

    @Query("SELECT h FROM Hospital h LEFT JOIN FETCH h.doctors WHERE h.id = :id")
    Optional<Hospital> findByIdWithDoctors(Long id);

    List<Hospital> findByNameContainingIgnoreCase(String name);
}
