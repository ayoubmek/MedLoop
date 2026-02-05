package com.example.hospitalservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"appointments", "doctor"})  // ADD THIS LINE
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Patient name is required")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Patient first name is required")
    @Column(nullable = false)
    private String prenom;

    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @NotNull(message = "Date of birth is required")
    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Column(length = 50)
    private String sexe;

    @Column(length = 500)
    private String adresse;

    @Column(length = 100)
    private String codePostal;

    @Column(length = 100)
    private String ville;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Medecin doctor;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}