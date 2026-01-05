import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordonnance } from '../models/ordonnance';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class OrdonnanceService {
    constructor(private http: HttpClient) { }

    getAllOrdonnances(): Observable<Ordonnance[]> {
        return this.http.get<Ordonnance[]>(environment.baseUrl + 'ordonnances');
    }
}
