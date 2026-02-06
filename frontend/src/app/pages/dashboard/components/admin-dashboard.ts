import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { KeycloakService, AuditLog, DashboardMetrics } from '../../../services/keycloak.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ChartModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-8">
      <h1 class="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <!-- Auth Required Warning -->
      <div *ngIf="authRequired" class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p class="text-yellow-800">
          <i class="pi pi-exclamation-triangle mr-2"></i>
          Please log in to view dashboard data
        </p>
      </div>
      
      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div class="text-gray-600 text-sm font-semibold">Total Doctors</div>
          <div class="text-3xl font-bold text-blue-600">{{ metrics?.totalDoctors || 0 }}</div>
        </div>
        
        <div class="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div class="text-gray-600 text-sm font-semibold">Active Doctors</div>
          <div class="text-3xl font-bold text-green-600">{{ metrics?.activeDoctors || 0 }}</div>
        </div>
        
        <div class="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <div class="text-gray-600 text-sm font-semibold">Total Patients</div>
          <div class="text-3xl font-bold text-purple-600">{{ metrics?.totalPatients || 0 }}</div>
        </div>
        
        <div class="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
          <div class="text-gray-600 text-sm font-semibold">Active Patients</div>
          <div class="text-3xl font-bold text-orange-600">{{ metrics?.activePatients || 0 }}</div>
        </div>

        <div class="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <div class="text-gray-600 text-sm font-semibold">Total Beds</div>
          <div class="text-3xl font-bold text-red-600">{{ metrics?.totalBeds || 0 }}</div>
        </div>

        <div class="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
          <div class="text-gray-600 text-sm font-semibold">Available Beds</div>
          <div class="text-3xl font-bold text-cyan-600">{{ metrics?.availableBeds || 0 }}</div>
        </div>

        <div class="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <div class="text-gray-600 text-sm font-semibold">Bed Occupancy Rate</div>
          <div class="text-3xl font-bold text-indigo-600">{{ metrics?.bedOccupancyRate || 0 }}%</div>
        </div>

        <div class="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
          <div class="text-gray-600 text-sm font-semibold">Total Users</div>
          <div class="text-3xl font-bold text-pink-600">{{ metrics?.totalUsers || 0 }}</div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6">
        <div class="flex gap-2 border-b">
          <button 
            (click)="activeTab = 'logs'"
            [ngClass]="{
              'px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold': activeTab === 'logs',
              'px-4 py-2 text-gray-600 hover:text-gray-800': activeTab !== 'logs'
            }">
            <i class="pi pi-list mr-2"></i>Keycloak Audit Logs
          </button>
          <button 
            (click)="activeTab = 'stats'"
            [ngClass]="{
              'px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold': activeTab === 'stats',
              'px-4 py-2 text-gray-600 hover:text-gray-800': activeTab !== 'stats'
            }">
            <i class="pi pi-chart-bar mr-2"></i>System Statistics
          </button>
          <button 
            (click)="activeTab = 'activity'"
            [ngClass]="{
              'px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold': activeTab === 'activity',
              'px-4 py-2 text-gray-600 hover:text-gray-800': activeTab !== 'activity'
            }">
            <i class="pi pi-history mr-2"></i>Recent Activity
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="mt-6">
        <!-- Audit Logs Tab -->
        <div *ngIf="activeTab === 'logs'">
          <p-table
            [value]="auditLogs"
            [paginator]="true"
            [rows]="10"
            [tableStyle]="{ 'min-width': '100%' }"
            responsiveLayout="scroll"
            [loading]="loading"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="timestamp">Timestamp <p-sortIcon field="timestamp"></p-sortIcon></th>
                <th pSortableColumn="username">Username <p-sortIcon field="username"></p-sortIcon></th>
                <th pSortableColumn="action">Action <p-sortIcon field="action"></p-sortIcon></th>
                <th pSortableColumn="entityType">Entity Type <p-sortIcon field="entityType"></p-sortIcon></th>
                <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-log>
              <tr>
                <td>{{ log.timestamp | date: 'short' }}</td>
                <td>{{ log.username }}</td>
                <td>
                  <span class="px-3 py-1 rounded-full text-sm font-semibold"
                    [ngClass]="{
                      'bg-blue-100 text-blue-800': log.action === 'CREATE',
                      'bg-green-100 text-green-800': log.action === 'READ',
                      'bg-yellow-100 text-yellow-800': log.action === 'UPDATE',
                      'bg-red-100 text-red-800': log.action === 'DELETE'
                    }">
                    {{ log.action }}
                  </span>
                </td>
                <td>{{ log.entityType }}</td>
                <td>
                  <span class="px-3 py-1 rounded-full text-sm font-semibold"
                    [ngClass]="{
                      'bg-green-100 text-green-800': log.status === 'SUCCESS',
                      'bg-red-100 text-red-800': log.status === 'FAILED'
                    }">
                    {{ log.status }}
                  </span>
                </td>
                <td>{{ log.details }}</td>
                <td>{{ log.ipAddress }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center py-4">
                  No audit logs found
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- System Statistics Tab -->
        <div *ngIf="activeTab === 'stats'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Distribution Chart -->
            <div class="p-6 bg-white rounded-lg shadow border">
              <h3 class="text-xl font-bold mb-4">User Distribution</h3>
              <p-chart type="doughnut" [data]="userDistributionChart"></p-chart>
            </div>

            <!-- Statistics Summary -->
            <div class="p-6 bg-white rounded-lg shadow border">
              <h3 class="text-xl font-bold mb-4">System Overview</h3>
              <div class="space-y-4">
                <div class="flex justify-between border-b pb-2">
                  <span class="font-semibold">Doctors</span>
                  <span class="text-lg">{{ metrics?.totalDoctors || 0 }}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="font-semibold">Patients</span>
                  <span class="text-lg">{{ metrics?.totalPatients || 0 }}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="font-semibold">Active Users</span>
                  <span class="text-lg">{{ (metrics?.activeDoctors || 0) + (metrics?.activePatients || 0) }}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="font-semibold">Total Users</span>
                  <span class="text-lg">{{ metrics?.totalUsers || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Bed Occupancy</span>
                  <span class="text-lg">{{ metrics?.bedOccupancyRate || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Log Tab -->
        <div *ngIf="activeTab === 'activity'">
          <div class="space-y-4">
            <ng-container *ngFor="let log of auditLogs | slice:0:20">
              <div class="p-4 border-l-4 rounded bg-white border"
                [ngClass]="{
                  'border-l-blue-500': log.action === 'CREATE',
                  'border-l-green-500': log.action === 'READ',
                  'border-l-yellow-500': log.action === 'UPDATE',
                  'border-l-red-500': log.action === 'DELETE'
                }">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-bold">{{ log.username }}</p>
                    <p class="text-sm text-gray-600">{{ log.action }} {{ log.entityType }}</p>
                  </div>
                  <span class="text-xs text-gray-500">{{ log.timestamp | date: 'short' }}</span>
                </div>
                <p class="text-sm">{{ log.details }}</p>
                <p class="text-xs text-gray-500 mt-2">IP: {{ log.ipAddress }} | Status: {{ log.status }}</p>
              </div>
            </ng-container>
            <div *ngIf="!auditLogs || auditLogs.length === 0" class="text-center py-8 text-gray-500">
              No activity found
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-table .p-datatable-tbody > tr > td {
        padding: 1rem 1rem;
      }
      
      .p-chart {
        position: relative;
        height: 400px;
      }
    }
  `]
})
export class AdminDashboard implements OnInit {
  metrics: DashboardMetrics | null = null;
  auditLogs: AuditLog[] = [];
  loading = true;
  userDistributionChart: any;
  activeTab: 'logs' | 'stats' | 'activity' = 'logs';
  authRequired = false;

  constructor(
    private keycloakService: KeycloakService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading = true;
    this.authRequired = false;
    
    // Load metrics
    this.keycloakService.getStatistics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.initializeCharts();
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        // Set default metrics to show something
        this.metrics = {
          totalDoctors: 0,
          activeDoctors: 0,
          totalPatients: 0,
          activePatients: 0,
          totalHospitals: 0,
          totalBeds: 0,
          availableBeds: 0,
          bedOccupancyRate: 0,
          totalUsers: 0,
          recentAuditLogs: []
        };
        this.initializeCharts();
        
        if (err.status === 401) {
          this.authRequired = true;
        } else if (err.status === 500) {
          console.error('Server error loading statistics');
        }
      }
    });

    // Load audit logs
    this.keycloakService.getAuditLogs(0, 50).subscribe({
      next: (data) => {
        this.auditLogs = data.content || data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading audit logs:', err);
        // Set empty logs array
        this.auditLogs = [];
        this.loading = false;
        
        if (err.status === 401) {
          this.authRequired = true;
        }
      }
    });
  }

  private initializeCharts() {
    if (!this.metrics) return;

    // User distribution chart
    this.userDistributionChart = {
      labels: ['Doctors', 'Patients', 'Other Users'],
      datasets: [
        {
          data: [
            this.metrics.totalDoctors,
            this.metrics.totalPatients,
            Math.max(0, (this.metrics.totalUsers || 0) - this.metrics.totalDoctors - this.metrics.totalPatients)
          ],
          backgroundColor: [
            '#3b82f6',
            '#a855f7',
            '#ec4899'
          ]
        }
      ]
    };
  }
}
