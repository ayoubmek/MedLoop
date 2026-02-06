import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface AuditLog {
  id?: number;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface DashboardMetrics {
  totalDoctors: number;
  totalPatients: number;
  activeDoctors: number;
  activePatients: number;
  totalHospitals: number;
  totalBeds: number;
  availableBeds: number;
  bedOccupancyRate: number;
  totalUsers: number;
  recentAuditLogs: AuditLog[];
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private apiUrl = 'http://localhost:8081/api/keycloak';
  private auditUrl = 'http://localhost:8081/api/audit';
  private statisticsUrl = 'http://localhost:8081/api/statistics';

  constructor(private http: HttpClient) { }

  createUser(req: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, req);
  }

  getAuditLogs(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.auditUrl}/logs?page=${page}&size=${size}`);
  }

  getAuditLogsByUser(userId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.auditUrl}/logs/user/${userId}`);
  }

  getStatistics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.statisticsUrl}/dashboard`);
  }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.statisticsUrl}/metrics`);
  }
}
