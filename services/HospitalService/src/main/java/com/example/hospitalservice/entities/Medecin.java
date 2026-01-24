package com.example.hospitalservice.entities;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.entities.MedicalService;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "medecins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medecin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false, unique = true)
    private String numeroOrdre;

    @Column(nullable = false)
    private String telephone;

    private boolean disponible;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private MedicalService service;

    @ManyToOne
    @JoinColumn(name = "hopital_id")
    private Hospital hopital;

    @OneToMany(mappedBy = "medecin")
    private List<Appointment> appointments;
}
