package com.medloop.admin.client;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedecinSyncDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String specialite;
    private String numeroOrdre;
    private String telephone;
    private Boolean disponible;
    private Long hopitalId;
}
