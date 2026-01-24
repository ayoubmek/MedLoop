package com.example.hospitalservice.service;

import com.example.hospitalservice.Repository.AppointmentRepository;
import com.example.hospitalservice.Repository.HospitalRepository;
import com.example.hospitalservice.Repository.MedicalServiceRepository;
import com.example.hospitalservice.entities.Appointment;
import com.example.hospitalservice.entities.AppointmentStatus;
import com.example.hospitalservice.entities.MedicalService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final MedicalServiceRepository medicalServiceRepository;
    private final HospitalRepository hospitalRepository;


    public AppointmentService(AppointmentRepository appointmentRepository,
                              MedicalServiceRepository medicalServiceRepository,
                              HospitalRepository hospitalRepository) {
        this.appointmentRepository = appointmentRepository;
        this.medicalServiceRepository = medicalServiceRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllWithService();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Rendez-vous non trouvé avec l'ID : " + id));
    }
    // Nouveau: Récupérer les appointments par service
    public List<Appointment> getAppointmentsByService(Long serviceId) {
        if (!medicalServiceRepository.existsById(serviceId)) {
            throw new NoSuchElementException("Service médical non trouvé avec l'ID : " + serviceId);
        }
        return appointmentRepository.findByServiceId(serviceId);
    }

    // Nouveau: Récupérer les appointments par hôpital
    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        if (!hospitalRepository.existsById(hospitalId)) {
            throw new NoSuchElementException("Hôpital non trouvé avec l'ID : " + hospitalId);
        }
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public Appointment createAppointment(Appointment appointment) {
        MedicalService service = medicalServiceRepository.findById(appointment.getService().getId())
                .orElseThrow(() -> new IllegalArgumentException("Service médical introuvable"));

        LocalDateTime start = appointment.getDateTime();
        LocalDateTime end = start.plusMinutes(appointment.getDuration());

        if (appointmentRepository.existsByDoctorIdAndDateTimeBetween(
                appointment.getDoctorId(), start.minusMinutes(1), end)) {
            throw new IllegalStateException("Le médecin a déjà un rendez-vous dans ce créneau");
        }

        appointment.setService(service);
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment existing = getAppointmentById(id);

        if (!existing.getDoctorId().equals(updated.getDoctorId()) ||
                !existing.getDateTime().equals(updated.getDateTime()) ||
                !existing.getDuration().equals(updated.getDuration())) {

            LocalDateTime start = updated.getDateTime();
            LocalDateTime end = start.plusMinutes(updated.getDuration());

            if (appointmentRepository.existsByDoctorIdAndDateTimeBetween(
                    updated.getDoctorId(), start.minusMinutes(1), end)) {
                throw new IllegalStateException("Nouveau créneau en conflit avec un autre rendez-vous");
            }
        }

        existing.setDateTime(updated.getDateTime());
        existing.setDuration(updated.getDuration());
        existing.setStatus(updated.getStatus());
        existing.setBedId(updated.getBedId());
        existing.setService(updated.getService());
        existing.setDoctorId(updated.getDoctorId());
        existing.setPatientId(updated.getPatientId());

        return appointmentRepository.save(existing);
    }

    public void cancelAppointment(Long id) {
        System.out.println("Service: Début cancelAppointment pour ID: " + id);

        Appointment appointment = getAppointmentById(id);

        System.out.println("Appointment trouvé - Status actuel: " + appointment.getStatus());

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Appointment saved = appointmentRepository.save(appointment);

        System.out.println("Appointment sauvegardé - Nouveau status: " + saved.getStatus());
    }

    // AJOUT: Nouvelle méthode pour la suppression
    public void deleteAppointment(Long id) {
        System.out.println("Service: Début deleteAppointment pour ID: " + id);

        // Vérifier que le rendez-vous existe
        Appointment appointment = getAppointmentById(id);

        System.out.println("Appointment trouvé - Suppression en cours");

        // Supprimer le rendez-vous
        appointmentRepository.delete(appointment);

        System.out.println("Appointment supprimé avec succès");
    }


    public List<LocalDateTime> getAvailableSlots(Long serviceId, LocalDateTime date) {

        return List.of(
                LocalDateTime.of(date.toLocalDate(), java.time.LocalTime.of(9, 0)),
                LocalDateTime.of(date.toLocalDate(), java.time.LocalTime.of(9, 30)),
                LocalDateTime.of(date.toLocalDate(), java.time.LocalTime.of(10, 0))
        );
    }
}
