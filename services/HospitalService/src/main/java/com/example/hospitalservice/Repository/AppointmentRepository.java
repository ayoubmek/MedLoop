package com.example.hospitalservice.Repository;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // REMOVED: existsByDoctorIdAndDateTimeBetween - this was causing the error
    // ADDED: New method with correct path to medecin.id
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
            "WHERE a.medecin.id = :medecinId " +
            "AND a.dateTime >= :start " +
            "AND a.dateTime < :end")
    boolean existsByMedecinIdAndDateTimeBetween(
            @Param("medecinId") Long medecinId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    void deleteByService_Id(Long serviceId);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.service")
    List<Appointment> findAllWithService();

    @Query("SELECT a FROM Appointment a WHERE a.service.id = :serviceId AND DATE(a.dateTime) = :date AND a.status IN :activeStatuses")
    List<Appointment> findAppointmentsByServiceAndDate(
            @Param("serviceId") Long serviceId,
            @Param("date") LocalDateTime date,
            @Param("activeStatuses") List<AppointmentStatus> activeStatuses
    );

    void deleteByServiceId(Long serviceId);

    // Trouver tous les appointments par service
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.service s WHERE s.id = :serviceId")
    List<Appointment> findByServiceId(@Param("serviceId") Long serviceId);

    // Trouver tous les appointments par hôpital
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.service s LEFT JOIN FETCH s.hospital h WHERE h.id = :hospitalId")
    List<Appointment> findByHospitalId(@Param("hospitalId") Long hospitalId);

    // Tous les RDV d'un médecin
    List<Appointment> findByMedecinId(Long medecinId);

    // Alias for findByMedecinId
    List<Appointment> findByMedecin_Id(Long medecinId);
}