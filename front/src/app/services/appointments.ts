import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentCreateDTO } from '../models/appointment.model';
@Injectable({
  providedIn: 'root'
})
export class Appointments {
  private apiUrl = 'http://localhost:8080/hospitalService/api/appointments';

  constructor(private http: HttpClient) {}

  // Récupérer tous les rendez-vous
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/getAll`);
  }

  // Récupérer un rendez-vous par ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les rendez-vous par service
  getAppointmentsByService(serviceId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  // Récupérer les rendez-vous par hôpital
  getAppointmentsByHospital(hospitalId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/hospital/${hospitalId}`);
  }

  // Créer un rendez-vous
  createAppointment(appointmentData: AppointmentCreateDTO): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointmentData);
  }

  // Mettre à jour un rendez-vous
  updateAppointment(id: number, appointmentData: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update/${id}`, appointmentData);
  }

    // Annuler un rendez-vous - CORRIGÉ: PUT au lieu de POST
  cancelAppointment(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Supprimer un rendez-vous - CORRIGÉ: URL sans /delete
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les créneaux disponibles
  getAvailableSlots(serviceId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available`, {
      params: { serviceId: serviceId.toString(), date }
    });
  }
}
