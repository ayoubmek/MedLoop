import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointments } from '../../../services/appointments';
import { PatientService } from '../../../services/patient.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Patient } from '../../../models/patient.model';

@Component({
    standalone: true,
    selector: 'app-doctor-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Rendez-vous Confirmés</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ confirmedAppointments }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ pendingAppointments }}</span>
                <span class="text-muted-color"> en attente</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Rendez-vous Aujourd'hui</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ todayAppointments }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ tomorrowAppointments }}</span>
                <span class="text-muted-color"> demain</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Patients Actifs</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalPatients }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ newPatients }}</span>
                <span class="text-muted-color"> ce mois</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Rendez-vous Annulés</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ cancelledAppointments }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-red-100 dark:bg-red-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-times-circle text-red-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ noShowAppointments }}</span>
                <span class="text-muted-color"> absences</span>
            </div>
        </div>
    `
})
export class DoctorStatsWidget implements OnInit {
    confirmedAppointments = 0;
    pendingAppointments = 0;
    todayAppointments = 0;
    tomorrowAppointments = 0;
    totalPatients = 0;
    newPatients = 0;
    cancelledAppointments = 0;
    noShowAppointments = 0;

    constructor(
        private appointmentsService: Appointments,
        private patientService: PatientService
    ) {}

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        // Load appointments
        this.appointmentsService.getAllAppointments().subscribe({
            next: (appointments: Appointment[]) => {
                this.calculateAppointmentStats(appointments);
            },
            error: (err) => console.error('Error loading appointments:', err)
        });

        // Load patients
        this.patientService.getAllPatients().subscribe({
            next: (patients: Patient[]) => {
                this.totalPatients = patients.length;
                this.newPatients = this.calculateNewPatients(patients);
            },
            error: (err) => console.error('Error loading patients:', err)
        });
    }

    calculateAppointmentStats(appointments: Appointment[]): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        appointments.forEach(apt => {
            const aptDate = new Date(apt.dateTime);
            aptDate.setHours(0, 0, 0, 0);

            // Count by status
            if (apt.status === AppointmentStatus.CONFIRMED) {
                this.confirmedAppointments++;
            } else if (apt.status === AppointmentStatus.PENDING) {
                this.pendingAppointments++;
            } else if (apt.status === AppointmentStatus.CANCELLED) {
                this.cancelledAppointments++;
            } else if (apt.status === AppointmentStatus.NO_SHOW) {
                this.noShowAppointments++;
            }

            // Count by date
            if (aptDate.getTime() === today.getTime()) {
                this.todayAppointments++;
            } else if (aptDate.getTime() === tomorrow.getTime()) {
                this.tomorrowAppointments++;
            }
        });
    }

    calculateNewPatients(patients: Patient[]): number {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return patients.filter(patient => {
            // Assuming createdAt field exists, adjust based on your actual data
            return true; // placeholder - adjust based on actual patient creation date
        }).length;
    }
}
