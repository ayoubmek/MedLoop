import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingAppointmentsWidget } from './components/upcoming-appointments-widget';
import { DoctorStatsWidget } from './components/doctor-stats-widget';
import { TodayScheduleWidget } from './components/today-schedule-widget';
import { PatientsOverviewWidget } from './components/patients-overview-widget';
import { Appointments } from '../../services/appointments';
import { PatientService } from '../../services/patient.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        UpcomingAppointmentsWidget,
        DoctorStatsWidget,
        TodayScheduleWidget,
        PatientsOverviewWidget
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Header -->
            <div class="col-span-12">
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">Tableau de Bord</h1>
                <p class="text-muted-color">Bienvenue sur votre espace médecin</p>
            </div>

            <!-- Stats Row -->
            <app-doctor-stats-widget class="contents" />

            <!-- Main Content -->
            <div class="col-span-12 lg:col-span-8">
                <app-today-schedule-widget />
            </div>

            <div class="col-span-12 lg:col-span-4">
                <app-patients-overview-widget />
            </div>

            <!-- Upcoming Appointments -->
            <div class="col-span-12">
                <app-upcoming-appointments-widget />
            </div>
        </div>
    `,
    providers: [Appointments, PatientService]
})
export class Dashboard implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
