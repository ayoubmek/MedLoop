package com.example.hospitalservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    @NotNull(message = "L'ID du médecin est requis")
    private Long doctorId;

    @ManyToOne(fetch = FetchType.EAGER)  // Changé de LAZY à EAGER
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"services", "hospital"})  // Évite la récursion
    private MedicalService service;

    @NotNull(message = "La date et l'heure sont requises")
    @FutureOrPresent(message = "La date du rendez-vous ne peut pas être dans le passé")
    @Column(nullable = false)
    private LocalDateTime dateTime;

    @NotNull(message = "La durée est requise")
    @Min(value = 15, message = "La durée minimale est de 15 minutes")
    @Column(nullable = false)
    private Integer duration; // en minutes

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    private Long bedId; // affecté ou nn

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
