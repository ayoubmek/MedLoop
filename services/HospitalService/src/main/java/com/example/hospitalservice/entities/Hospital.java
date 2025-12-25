package com.example.hospitalservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'hôpital est requis")
    @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "L'adresse est requise")
    @Size(max = 255)
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "Le numéro de téléphone est requis")
    @Size(max = 20)
    @Column(nullable = false, unique = true)
    private String phone;

    @Email(message = "Email invalide")
    @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("hospital") // Ignore seulement le champ hospital dans MedicalService
    private List<MedicalService> services = new ArrayList<>();

}
