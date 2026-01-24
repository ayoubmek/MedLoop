package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.HospitalRepository;
import com.example.hospitalservice.Repository.MedicalServiceRepository;
import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.entities.MedicalService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class MedicalServiceService {
    private final MedicalServiceRepository medicalServiceRepository;
    private final HospitalRepository hospitalRepository;

    @Autowired
    public MedicalServiceService(MedicalServiceRepository medicalServiceRepository,
                                 HospitalRepository hospitalRepository) {
        this.medicalServiceRepository = medicalServiceRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public List<MedicalService> getAllServices() {
        List<MedicalService> services = medicalServiceRepository.findAll();
        // Force le chargement de l'hôpital pour chaque service
        services.forEach(service -> {
            if (service.getHospital() != null) {
                service.getHospital().getName(); // Force l'initialisation
            }
        });
        return services;
    }

    public MedicalService getServiceById(Long id) {
        return medicalServiceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Service médical non trouvé avec l'ID : " + id));
    }

    public List<MedicalService> getServicesByHospital(Long hospitalId) {
        if (!hospitalRepository.existsById(hospitalId)) {
            throw new NoSuchElementException("Hôpital non trouvé avec l'ID : " + hospitalId);
        }
        return medicalServiceRepository.findByHospitalId(hospitalId);
    }

    public MedicalService createService(MedicalService service) {
        Hospital hospital = hospitalRepository.findById(service.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Hôpital introuvable"));

        if (medicalServiceRepository.existsByNameAndHospitalId(service.getName(), hospital.getId())) {
            throw new IllegalArgumentException("Un service avec ce nom existe déjà dans cet hôpital");
        }

        if (service.getAvailableBeds() > service.getTotalBeds()) {
            throw new IllegalArgumentException("Le nombre de lits disponibles ne peut pas dépasser la capacité totale");
        }

        service.setHospital(hospital);
        return medicalServiceRepository.save(service);
    }

    public MedicalService updateService(Long id, MedicalService serviceDetails) {
        MedicalService existing = getServiceById(id);
        Hospital hospital = hospitalRepository.findById(serviceDetails.getHospital().getId())
                .orElseThrow(() -> new IllegalArgumentException("Hôpital introuvable"));

        if (!existing.getName().equals(serviceDetails.getName()) &&
                medicalServiceRepository.existsByNameAndHospitalId(serviceDetails.getName(), hospital.getId())) {
            throw new IllegalArgumentException("Nom de service déjà utilisé dans cet hôpital");
        }

        if (serviceDetails.getAvailableBeds() > serviceDetails.getTotalBeds()) {
            throw new IllegalArgumentException("Capacité de lits invalide");
        }

        existing.setName(serviceDetails.getName());
        existing.setDepartment(serviceDetails.getDepartment());
        existing.setTotalBeds(serviceDetails.getTotalBeds());
        existing.setAvailableBeds(serviceDetails.getAvailableBeds());
        existing.setHospital(hospital);

        return medicalServiceRepository.save(existing);
    }

    public void deleteService(Long id) {
        if (!medicalServiceRepository.existsById(id)) {
            throw new NoSuchElementException("Service introuvable");
        }
        medicalServiceRepository.deleteById(id);
    }
    public List<MedicalService> getAllServicesWithHospital() {
        List<MedicalService> services = medicalServiceRepository.findAll();
        // Pour chaque service, on crée un wrapper manuel pour inclure l'hôpital
        services.forEach(service -> {
            if (service.getHospital() != null) {
                // Force le chargement de l'hôpital sans charger ses services
                Hospital hospital = service.getHospital();
                hospital.getName(); // Force l'initialisation
                // Vide temporairement la liste des services pour éviter la récursion
                hospital.setServices(new ArrayList<>());
            }
        });
        return services;
    }
}
