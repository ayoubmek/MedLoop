package com.medloop.admin.client;

import com.medloop.admin.dto.DoctorDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

@Component
@RequiredArgsConstructor
@Slf4j
public class HospitalServiceClient {

    private final RestTemplate restTemplate;

    @Value("${hospital-service.url:http://localhost:8082/hospitalService}")
    private String hospitalServiceUrl;

    /**
     * Sync a new doctor to the Hospital Service as Medecin
     */
    public void createMedecinFromDoctor(DoctorDTO doctorDTO) {
        try {
            String url = hospitalServiceUrl + "/api/medecins/sync/create";
            MedecinSyncDTO syncDTO = convertToMedecinSync(doctorDTO);
            
            log.info("Syncing new doctor to hospital service: {}", doctorDTO.getName());
            restTemplate.postForObject(url, syncDTO, MedecinSyncDTO.class);
            log.info("Successfully synced doctor: {}", doctorDTO.getName());
        } catch (RestClientException e) {
            // Log the error but don't fail the operation - eventual consistency
            log.warn("Failed to sync doctor creation to hospital service: {}", doctorDTO.getName(), e);
        }
    }

    /**
     * Sync doctor update to the Hospital Service
     */
    public void updateMedecinFromDoctor(Long doctorId, DoctorDTO doctorDTO) {
        try {
            String url = hospitalServiceUrl + "/api/medecins/sync/update/" + doctorId;
            MedecinSyncDTO syncDTO = convertToMedecinSync(doctorDTO);
            
            log.info("Syncing doctor update to hospital service: {}", doctorDTO.getName());
            restTemplate.put(url, syncDTO);
            log.info("Successfully synced doctor update: {}", doctorDTO.getName());
        } catch (RestClientException e) {
            // Log the error but don't fail the operation - eventual consistency
            log.warn("Failed to sync doctor update to hospital service: {}", doctorDTO.getName(), e);
        }
    }

    /**
     * Sync doctor deletion to the Hospital Service
     */
    public void deleteMedecinFromDoctor(Long doctorId, String doctorName) {
        try {
            String url = hospitalServiceUrl + "/api/medecins/sync/delete/" + doctorId;
            
            log.info("Syncing doctor deletion to hospital service: {}", doctorName);
            restTemplate.delete(url);
            log.info("Successfully synced doctor deletion: {}", doctorName);
        } catch (RestClientException e) {
            // Log the error but don't fail the operation - eventual consistency
            log.warn("Failed to sync doctor deletion to hospital service for doctor id: {}", doctorId, e);
        }
    }

    /**
     * Convert Doctor DTO to Medecin Sync DTO
     */
    private MedecinSyncDTO convertToMedecinSync(DoctorDTO doctorDTO) {
        return MedecinSyncDTO.builder()
                .id(doctorDTO.getId())
                .nom(extractLastName(doctorDTO.getName()))
                .prenom(extractFirstName(doctorDTO.getName()))
                .specialite(doctorDTO.getSpecialization())
                .numeroOrdre(doctorDTO.getLicenseNumber())
                .telephone(doctorDTO.getPhone())
                .disponible(doctorDTO.getIsActive() != null ? doctorDTO.getIsActive() : true)
                .hopitalId(doctorDTO.getHospitalId())
                .build();
    }

    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts.length > 1 ? parts[0] : "";
    }

    private String extractLastName(String fullName) {
        if (fullName == null || fullName.isEmpty()) {
            return fullName;
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts.length > 1 ? parts[parts.length - 1] : fullName;
    }
}
