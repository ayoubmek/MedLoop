package com.example.hospitalservice.Controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedecinSyncRequest {
    private Long id;
    private String nom;
    private String prenom;
    private String specialite;
    private String numeroOrdre;
    private String telephone;
    private Boolean disponible;
    private Long hopitalId;
}
