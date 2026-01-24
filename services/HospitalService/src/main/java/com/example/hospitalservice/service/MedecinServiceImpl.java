package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.AppointmentRepository;
import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Medecin;
import com.example.hospitalservice.Repository.MedecinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedecinServiceImpl implements MedecinService {

    private final MedecinRepository medecinRepository;
    private final AppointmentRepository appointmentRepository;
    @Override
    public Medecin saveMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }
    @Override
    public List<Appointment> getAppointmentsByMedecin(Long medecinId) {
        return appointmentRepository.findByMedecinId(medecinId);
    }

    @Override
    public List<Appointment> getAppointmentsByService(Long medecinId) {

        Medecin medecin = medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

        Long serviceId = medecin.getService().getId();

        return appointmentRepository.findByServiceId(serviceId);
    }
    @Override
    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }

    @Override
    public Medecin getMedecinById(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));
    }

    @Override
    public void deleteMedecin(Long id) {
        medecinRepository.deleteById(id);
    }

    @Override
    public Medecin updateMedecin(Long id, Medecin medecinDetails) {
        Medecin medecin = getMedecinById(id);

        medecin.setNom(medecinDetails.getNom());
        medecin.setPrenom(medecinDetails.getPrenom());
        medecin.setSpecialite(medecinDetails.getSpecialite());
        medecin.setNumeroOrdre(medecinDetails.getNumeroOrdre());
        medecin.setTelephone(medecinDetails.getTelephone());
        medecin.setDisponible(medecinDetails.isDisponible());
        medecin.setService(medecinDetails.getService());
        medecin.setHopital(medecinDetails.getHopital());

        return medecinRepository.save(medecin);
    }
}