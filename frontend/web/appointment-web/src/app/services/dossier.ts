import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Dossier } from '../models/dossier';

@Injectable({
  providedIn: 'root',
})
export class DossierService {

  constructor(private http: HttpClient) { }

  getAllDossiers(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(environment.baseUrl + 'dossiers');
  }

  getDossierById(id: number): Observable<Dossier> {
    return this.http.get<Dossier>(environment.baseUrl + 'dossiers/' + id);
  }

  createDossier(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(environment.baseUrl + 'dossiers', dossier);
  }

  updateDossier(id: number, dossier: Dossier): Observable<Dossier> {
    return this.http.put<Dossier>(environment.baseUrl + 'dossiers/' + id, dossier);
  }

  deleteDossier(id: number): Observable<void> {
    return this.http.delete<void>(environment.baseUrl + 'dossiers/' + id);
  }
}
