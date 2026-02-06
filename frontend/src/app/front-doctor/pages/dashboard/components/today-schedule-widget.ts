import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointments } from '../../../services/appointments';
import { PatientService } from '../../../services/patient.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model';

interface TodayAppointment extends Appointment {
    patientName?: string;
    timeOnly?: string;
}

@Component({
    standalone: true,
    selector: 'app-today-schedule-widget',
    imports: [CommonModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <h5 class="text-xl font-bold text-surface-900 dark:text-surface-0">Emploi du Temps Aujourd'hui</h5>
                <span class="text-sm text-muted-color bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full">
                    {{ todayAppointments.length }} rendez-vous
                </span>
            </div>
            
            <div class="space-y-3" *ngIf="todayAppointments.length > 0; else noToday">
                <div *ngFor="let apt of todayAppointments" 
                     class="flex items-start gap-4 p-4 border-l-4 border-primary bg-surface-50 dark:bg-surface-800 rounded-r-lg">
                    <div class="flex flex-col items-center justify-center min-w-fit">
                        <span class="text-2xl font-bold text-primary">{{ apt.timeOnly }}</span>
                        <span class="text-xs text-muted-color">{{ apt.duration }}min</span>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-surface-900 dark:text-surface-0">{{ apt.patientName }}</p>
                        <p class="text-sm text-muted-color">{{ getServiceName(apt) }}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span [ngClass]="'text-xs px-2 py-1 rounded ' + getStatusBadgeClass(apt.status)">
                                {{ getStatusLabel(apt.status) }}
                            </span>
                            <span class="text-xs text-muted-color" *ngIf="apt.bedId">
                                Lit #{{ apt.bedId }}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button (click)="viewDetails(apt)" 
                                class="p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition"
                                title="Voir les détails">
                            <i class="pi pi-eye text-primary"></i>
                        </button>
                    </div>
                </div>
            </div>

            <ng-template #noToday>
                <div class="text-center py-12">
                    <i class="pi pi-calendar text-5xl text-muted-color mb-3"></i>
                    <p class="text-muted-color">Aucun rendez-vous aujourd'hui</p>
                </div>
            </ng-template>
        </div>
    `
})
export class TodayScheduleWidget implements OnInit {
    todayAppointments: TodayAppointment[] = [];
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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                this.todayAppointments = appointments
                    .filter(apt => {
                        const aptDate = new Date(apt.dateTime);
                        aptDate.setHours(0, 0, 0, 0);
                        return aptDate.getTime() === today.getTime();
                    })
                    .map(apt => ({
                        ...apt,
                        patientName: this.getPatientName(apt.patientId),
                        timeOnly: this.getTimeOnly(apt.dateTime)
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

    getTimeOnly(dateTime: string): string {
        const date = new Date(dateTime);
        return date.toLocaleString('fr-FR', {
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

    getStatusBadgeClass(status: AppointmentStatus): string {
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

    viewDetails(apt: TodayAppointment): void {
        console.log('View details for appointment:', apt);
        // You can navigate to appointment details or show a modal
    }

    getServiceName(apt: TodayAppointment): string {
        if (apt.service && typeof apt.service === 'object' && 'name' in apt.service) {
            return (apt.service as any).name || 'Service';
        }
        return 'Service';
    }
}
