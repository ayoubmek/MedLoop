import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation';

import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ConsultationService {

    constructor(private http: HttpClient) { }

    getAllConsultations(): Observable<Consultation[]> {
        return this.http.get<Consultation[]>(environment.baseUrl + 'consultations');
    }

    getConsultationById(id: number): Observable<Consultation> {
        return this.http.get<Consultation>(environment.baseUrl + 'consultations/' + id);
    }

    createConsultation(consultation: Consultation): Observable<Consultation> {
        return this.http.post<Consultation>(environment.baseUrl + 'consultations', consultation);
    }

    updateConsultation(id: number, consultation: Consultation): Observable<Consultation> {
        return this.http.put<Consultation>(environment.baseUrl + 'consultations/' + id, consultation);
    }

    deleteConsultation(id: number): Observable<void> {
        return this.http.delete<void>(environment.baseUrl + 'consultations/' + id);
    }
}
