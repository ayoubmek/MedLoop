package com.example.hospitalservice.service;

import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.Medecin;

import java.util.List;

public interface MedecinService {

    Medecin saveMedecin(Medecin medecin);

    List<Medecin> getAllMedecins();

    Medecin getMedecinById(Long id);

    void deleteMedecin(Long id);
    List<Appointment> getAppointmentsByMedecin(Long medecinId);

    List<Appointment> getAppointmentsByService(Long medecinId);
    Medecin updateMedecin(Long id, Medecin medecinDetails);

}
