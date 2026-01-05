import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultatExamen } from '../models/resultat-examen';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ResultatExamenService {
    constructor(private http: HttpClient) { }

    getAllResultats(): Observable<ResultatExamen[]> {
        return this.http.get<ResultatExamen[]>(environment.baseUrl + 'resultats-examens');
    }
}
