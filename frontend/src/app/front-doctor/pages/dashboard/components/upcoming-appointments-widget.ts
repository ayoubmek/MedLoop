import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointments } from '../../../services/appointments';
import { PatientService } from '../../../services/patient.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model';

interface AppointmentWithPatient extends Appointment {
    patientName?: string;
}

@Component({
    standalone: true,
    selector: 'app-upcoming-appointments-widget',
    imports: [CommonModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <h5 class="text-xl font-bold text-surface-900 dark:text-surface-0">Rendez-vous à Venir</h5>
                <span class="text-sm text-muted-color">{{ upcomingAppointments.length }} rendez-vous</span>
            </div>
            
            <div class="space-y-4" *ngIf="upcomingAppointments.length > 0; else noAppointments">
                <div *ngFor="let apt of upcomingAppointments.slice(0, 5)" 
                     class="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition">
                    <div class="flex-1">
                        <p class="font-medium text-surface-900 dark:text-surface-0">{{ apt.patientName }}</p>
                        <p class="text-sm text-muted-color">{{ getServiceName(apt) }}</p>
                        <p class="text-xs text-muted-color mt-1">{{ formatDateTime(apt.dateTime) }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <span [ngClass]="'px-3 py-1 rounded-full text-xs font-medium ' + getStatusClass(apt.status)">
                            {{ getStatusLabel(apt.status) }}
                        </span>
                        <span class="text-xs text-muted-color">{{ apt.duration }} min</span>
                    </div>
                </div>
            </div>

            <ng-template #noAppointments>
                <div class="text-center py-8">
                    <i class="pi pi-calendar text-4xl text-muted-color mb-2"></i>
                    <p class="text-muted-color">Aucun rendez-vous à venir</p>
                </div>
            </ng-template>
        </div>
    `
})
export class UpcomingAppointmentsWidget implements OnInit {
    upcomingAppointments: AppointmentWithPatient[] = [];
    patients: Map<number, Patient> = new Map();

    constructor(
        private appointmentsService: Appointments,
        private patientService: PatientService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        // Load all patients first
        this.patientService.getAllPatients().subscribe({
            next: (patients: Patient[]) => {
                patients.forEach(p => {
                    if (p.id) {
                        this.patients.set(p.id, p);
                    }
                });
                // Then load appointments
                this.loadAppointments();
            },
            error: (err) => console.error('Error loading patients:', err)
        });
    }

    loadAppointments(): void {
        this.appointmentsService.getAllAppointments().subscribe({
            next: (appointments: Appointment[]) => {
                const now = new Date();
                
                this.upcomingAppointments = appointments
                    .filter(apt => {
                        const aptDate = new Date(apt.dateTime);
                        return aptDate > now && (apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING);
                    })
                    .map(apt => ({
                        ...apt,
                        patientName: this.getPatientName(apt.patientId)
                    }))
                    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            },
            error: (err) => console.error('Error loading appointments:', err)
        });
    }

    getPatientName(patientId: number): string {
        const patient = this.patients.get(patientId);
        if (patient) {
            return `${patient.prenom} ${patient.nom}`;
        }
        return `Patient ${patientId}`;
    }

    formatDateTime(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusLabel(status: AppointmentStatus): string {
        switch (status) {
            case AppointmentStatus.CONFIRMED:
                return 'Confirmé';
            case AppointmentStatus.PENDING:
                return 'En attente';
            case AppointmentStatus.CANCELLED:
                return 'Annulé';
            case AppointmentStatus.COMPLETED:
                return 'Terminé';
            case AppointmentStatus.NO_SHOW:
                return 'Absent';
            default:
                return String(status);
        }
    }

    getStatusClass(status: AppointmentStatus): string {
        switch (status) {
            case AppointmentStatus.CONFIRMED:
                return 'bg-green-100 text-green-700 dark:bg-green-400/20 dark:text-green-400';
            case AppointmentStatus.PENDING:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-400/20 dark:text-yellow-400';
            case AppointmentStatus.CANCELLED:
                return 'bg-red-100 text-red-700 dark:bg-red-400/20 dark:text-red-400';
            case AppointmentStatus.COMPLETED:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-400';
            case AppointmentStatus.NO_SHOW:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-400/20 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-400/20 dark:text-gray-400';
        }
    }

    getServiceName(apt: AppointmentWithPatient): string {
        if (apt.service && typeof apt.service === 'object' && 'name' in apt.service) {
            return (apt.service as any).name || 'Service';
        }
        return 'Service';
    }
}
