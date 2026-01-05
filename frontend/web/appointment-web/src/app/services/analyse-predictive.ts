import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalysePredictive } from '../models/analyse-predictive';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class AnalysePredictiveService {
    constructor(private http: HttpClient) { }

    getAllAnalyses(): Observable<AnalysePredictive[]> {
        return this.http.get<AnalysePredictive[]>(environment.baseUrl + 'analyses-predictives');
    }
}
