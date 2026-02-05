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

    public List<Appointment> getAppointmentsByService(Long serviceId) {
        if (!medicalServiceRepository.existsById(serviceId)) {
            throw new NoSuchElementException("Service médical non trouvé avec l'ID : " + serviceId);
        }
        return appointmentRepository.findByServiceId(serviceId);  // Use findByServiceId
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        if (!hospitalRepository.existsById(hospitalId)) {
            throw new NoSuchElementException("Hôpital non trouvé avec l'ID : " + hospitalId);
        }
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByMedecin_Id(doctorId);
    }

    public Appointment createAppointment(Appointment appointment) {
        // Service is now optional - only validate if provided
        if (appointment.getService() != null) {
            MedicalService service = medicalServiceRepository.findById(appointment.getService().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Service médical introuvable"));
            appointment.setService(service);
        }

        LocalDateTime start = appointment.getDateTime();
        LocalDateTime end = start.plusMinutes(appointment.getDuration());

        // Use the helper method to get doctor ID
        Long doctorId = appointment.getDoctorId();
        // FIXED: Use the correct repository method
        if (doctorId != null && appointmentRepository.existsByMedecinIdAndDateTimeBetween(
                doctorId, start, end)) {
            throw new IllegalStateException("Le médecin a déjà un rendez-vous dans ce créneau");
        }

        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment existing = getAppointmentById(id);

        Long existingDoctorId = existing.getDoctorId();
        Long updatedDoctorId = updated.getDoctorId();

        if ((existingDoctorId != null && !existingDoctorId.equals(updatedDoctorId)) ||
                !existing.getDateTime().equals(updated.getDateTime()) ||
                !existing.getDuration().equals(updated.getDuration())) {

            LocalDateTime start = updated.getDateTime();
            LocalDateTime end = start.plusMinutes(updated.getDuration());

            // FIXED: Use the correct repository method
            if (updatedDoctorId != null && appointmentRepository.existsByMedecinIdAndDateTimeBetween(
                    updatedDoctorId, start, end)) {
                throw new IllegalStateException("Nouveau créneau en conflit avec un autre rendez-vous");
            }
        }

        existing.setDateTime(updated.getDateTime());
        existing.setDuration(updated.getDuration());
        existing.setStatus(updated.getStatus());
        existing.setBedId(updated.getBedId());
        existing.setService(updated.getService());
        existing.setMedecin(updated.getMedecin());
        existing.setPatient(updated.getPatient());

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

    public void deleteAppointment(Long id) {
        System.out.println("Service: Début deleteAppointment pour ID: " + id);

        Appointment appointment = getAppointmentById(id);

        System.out.println("Appointment trouvé - Suppression en cours");

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