import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  constructor(private http: HttpClient) { }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(environment.baseUrl + 'patients');
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(environment.baseUrl + 'patients/' + id);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(environment.baseUrl + 'patients', patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(environment.baseUrl + 'patients/' + id, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(environment.baseUrl + 'patients/' + id);
  }
}
