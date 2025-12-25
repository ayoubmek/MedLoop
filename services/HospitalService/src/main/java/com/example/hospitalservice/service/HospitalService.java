package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.AppointmentRepository;
import com.example.hospitalservice.Repository.HospitalRepository;
import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.entities.MedicalService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class HospitalService {
    private final HospitalRepository hospitalRepository;
    private final AppointmentRepository appointmentRepository;

    public HospitalService(
            HospitalRepository hospitalRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.hospitalRepository = hospitalRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Hospital> getAllHospitals() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        // Force le chargement des services pour chaque hôpital
        hospitals.forEach(hospital -> {
            hospital.getServices().size(); // Force l'initialisation de la liste
        });
        return hospitals;
    }

    public Hospital getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hôpital non trouvé avec l'ID : " + id));
        // Force le chargement des services
        hospital.getServices().size();
        return hospital;
    }

    public Hospital createHospital(@Valid Hospital hospital) {
        if (hospitalRepository.existsByName(hospital.getName())) {
            throw new IllegalArgumentException("Un hôpital avec ce nom existe déjà");
        }
        if (hospitalRepository.existsByEmail(hospital.getEmail())) {
            throw new IllegalArgumentException("Un hôpital avec cet email existe déjà");
        }
        if (hospitalRepository.existsByPhone(hospital.getPhone())) {
            throw new IllegalArgumentException("Un hôpital avec ce numéro de téléphone existe déjà");
        }
        return hospitalRepository.save(hospital);
    }

    /*public Hospital updateHospital(Long id, @Valid Hospital hospitalDetails) {
        Hospital hospital = getHospitalById(id);

        if (!hospital.getName().equals(hospitalDetails.getName()) &&
                hospitalRepository.existsByName(hospitalDetails.getName())) {
            throw new IllegalArgumentException("Nom d'hôpital déjà utilisé");
        }
        if (!hospital.getEmail().equals(hospitalDetails.getEmail()) &&
                hospitalRepository.existsByEmail(hospitalDetails.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        if (!hospital.getPhone().equals(hospitalDetails.getPhone()) &&
                hospitalRepository.existsByPhone(hospitalDetails.getPhone())) {
            throw new IllegalArgumentException("Numéro de téléphone déjà utilisé");
        }

        hospital.setName(hospitalDetails.getName());
        hospital.setAddress(hospitalDetails.getAddress());
        hospital.setPhone(hospitalDetails.getPhone());
        hospital.setEmail(hospitalDetails.getEmail());
        hospital.setServices(hospitalDetails.getServices());

        return hospitalRepository.save(hospital);
    }*/
    public Hospital updateHospital(Long id, @Valid Hospital hospitalDetails) {
        Hospital hospital = getHospitalById(id);

        if (!hospital.getName().equals(hospitalDetails.getName()) &&
                hospitalRepository.existsByName(hospitalDetails.getName())) {
            throw new IllegalArgumentException("Nom d'hôpital déjà utilisé");
        }
        if (!hospital.getEmail().equals(hospitalDetails.getEmail()) &&
                hospitalRepository.existsByEmail(hospitalDetails.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        if (!hospital.getPhone().equals(hospitalDetails.getPhone()) &&
                hospitalRepository.existsByPhone(hospitalDetails.getPhone())) {
            throw new IllegalArgumentException("Numéro de téléphone déjà utilisé");
        }

        hospital.setName(hospitalDetails.getName());
        hospital.setAddress(hospitalDetails.getAddress());
        hospital.setPhone(hospitalDetails.getPhone());
        hospital.setEmail(hospitalDetails.getEmail());
        // NE PAS METTRE À JOUR LES SERVICES ICI
        // hospital.setServices(hospitalDetails.getServices());

        return hospitalRepository.save(hospital);
    }

    public void deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hôpital non trouvé"));

        for (MedicalService service : hospital.getServices()) {
            appointmentRepository.deleteByService_Id(service.getId());
        }

        hospitalRepository.deleteById(id);
    }

    // NOUVEAU : Méthode pour récupérer les services d'un hôpital
    public List<MedicalService> getHospitalServices(Long hospitalId) {
        Hospital hospital = getHospitalById(hospitalId);
        // Force le chargement des services
        return hospital.getServices();
    }
}
