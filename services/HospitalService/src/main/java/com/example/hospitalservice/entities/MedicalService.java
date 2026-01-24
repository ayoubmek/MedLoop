package com.example.hospitalservice.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Table(name = "medical_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du service est requis")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Le département est requis")
    @Column(nullable = false)
    private String department;

    @NotNull(message = "La capacité totale de lits est requise")
    @PositiveOrZero
    @Column(name = "total_beds", nullable = false)
    private Integer totalBeds = 0;

    @NotNull(message = "Le nombre de lits disponibles est requis")
    @PositiveOrZero
    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds = 0;

    @ManyToOne(fetch = FetchType.EAGER) // Changez LAZY en EAGER
    @JoinColumn(name = "hospital_id", nullable = false)
    @JsonIgnoreProperties("services") // Ignore seulement la liste services de Hospital
    private Hospital hospital;
}
