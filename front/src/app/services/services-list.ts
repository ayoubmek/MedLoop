import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalService } from '../models/service.model';
import { forkJoin, map } from 'rxjs';
import {catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesList {
  private apiUrl = 'http://localhost:8080/hospitalService/api/services';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<MedicalService[]> {
    return this.http.get<MedicalService[]>(`${this.apiUrl}/getAll`).pipe(
      tap(data => console.log('Data received:', data)), // Pour debug
      catchError(error => {
        console.error('Error details:', error);
        throw error;
      })
    );
  }
  getServiceById(id: number): Observable<MedicalService> {
    return this.http.get<MedicalService>(`${this.apiUrl}/${id}`);
  }
 getAllServicesWithHospital(): Observable<MedicalService[]> {
    return this.http.get<MedicalService[]>(`${this.apiUrl}/getAll`).pipe(
      map(services => {
        // Les services devraient déjà contenir l'hôpital si votre backend le renvoie
        return services.map(service => ({
          ...service,
          // Si hospital n'est pas inclus, ajoutez 'Non assigné'
          hospital: service.hospital || { id: 0, name: 'Non assigné' }
        }));
      })
    );
  }
// Créer un nouveau service
  createService(service: MedicalService): Observable<MedicalService> {
    return this.http.post<MedicalService>(`${this.apiUrl}/create`, service);
  }

  // Mettre à jour un service existant
  updateService(id: number, service: MedicalService): Observable<MedicalService> {
    return this.http.put<MedicalService>(`${this.apiUrl}/update/${id}`, service);
  }
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
