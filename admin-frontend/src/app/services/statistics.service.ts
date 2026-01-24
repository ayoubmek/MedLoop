import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Statistics } from '../models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8081/api/statistics';

  constructor(private http: HttpClient) { }

  getOverallStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/overall`);
  }
}