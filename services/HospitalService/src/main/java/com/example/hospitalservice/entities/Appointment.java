package com.example.hospitalservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"patient", "medecin"})
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull(message = "Le patient est requis")
    private Patient patient;

    // FIXED: Changed column name from "medecin_id" to "doctor_id"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")  // Changed from medecin_id
    private Medecin medecin;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = true)
    @JsonIgnoreProperties({"services", "hospital"})
    private MedicalService service;

    @NotNull(message = "La date et l'heure sont requises")
    @FutureOrPresent(message = "La date du rendez-vous ne peut pas être dans le passé")
    @Column(nullable = false)
    private LocalDateTime dateTime;

    @NotNull(message = "La durée est requise")
    @Min(value = 15, message = "La durée minimale est de 15 minutes")
    @Column(nullable = false)
    private Integer duration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    private Long bedId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Helper methods to get IDs if needed
    public Long getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    public Long getDoctorId() {
        return medecin != null ? medecin.getId() : null;
    }

    public Long getServiceId() {
        return service != null ? service.getId() : null;
    }
}