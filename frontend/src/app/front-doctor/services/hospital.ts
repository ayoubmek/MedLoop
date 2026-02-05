// src/app/services/hospital.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospital, CreateHospitalDto, UpdateHospitalDto } from '../models/hospital.model';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private apiUrl = 'http://localhost:8082/hospitalService/api/hospitals';

  constructor(private http: HttpClient) {}

  getAllHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.apiUrl}/getAll`);
  }

  getHospitalById(id: number): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.apiUrl}/${id}`);
  }

  createHospital(hospital: CreateHospitalDto): Observable<Hospital> {
    return this.http.post<Hospital>(`${this.apiUrl}/create`, hospital);
  }

  updateHospital(hospital: UpdateHospitalDto): Observable<Hospital> {
    return this.http.put<Hospital>(`${this.apiUrl}/update/${hospital.id}`, hospital);
  }

  deleteHospital(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}