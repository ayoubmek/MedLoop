import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
    standalone: true,
    selector: 'app-patients-overview-widget',
    imports: [CommonModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <h5 class="text-xl font-bold text-surface-900 dark:text-surface-0">Mes Patients</h5>
                <span class="text-2xl font-bold text-primary">{{ totalPatients }}</span>
            </div>

            <div class="space-y-4">
                <!-- Total Patients -->
                <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-400/10 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-lg">
                            <i class="pi pi-users text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div>
                            <p class="text-sm text-muted-color">Patients Actifs</p>
                            <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ totalPatients }}</p>
                        </div>
                    </div>
                </div>

                <!-- Gender Distribution -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-purple-50 dark:bg-purple-400/10 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p class="text-xs text-muted-color mb-1">Hommes</p>
                        <p class="text-lg font-semibold text-purple-600 dark:text-purple-400">{{ maleCount }}</p>
                        <p class="text-xs text-muted-color">{{ malePercentage }}%</p>
                    </div>
                    <div class="p-3 bg-pink-50 dark:bg-pink-400/10 rounded-lg border border-pink-200 dark:border-pink-800">
                        <p class="text-xs text-muted-color mb-1">Femmes</p>
                        <p class="text-lg font-semibold text-pink-600 dark:text-pink-400">{{ femaleCount }}</p>
                        <p class="text-xs text-muted-color">{{ femalePercentage }}%</p>
                    </div>
                </div>

                <!-- Recent Patients -->
                <div>
                    <p class="text-sm font-semibold text-surface-900 dark:text-surface-0 mb-3">Patients Récents</p>
                    <div class="space-y-2">
                        <div *ngFor="let patient of recentPatients" 
                             class="flex items-center justify-between p-2 hover:bg-surface-50 dark:hover:bg-surface-800 rounded transition">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-surface-900 dark:text-surface-0">
                                    {{ patient.prenom }} {{ patient.nom }}
                                </p>
                                <p class="text-xs text-muted-color">{{ patient.email }}</p>
                            </div>
                            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <i class="pi pi-user text-primary text-sm"></i>
                            </div>
                        </div>

                        <div *ngIf="recentPatients.length === 0" class="text-center py-4">
                            <p class="text-sm text-muted-color">Aucun patient</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <button class="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition font-medium text-sm">
                        <i class="pi pi-plus mr-2"></i>Ajouter Patient
                    </button>
                </div>
            </div>
        </div>
    `
})
export class PatientsOverviewWidget implements OnInit {
    totalPatients = 0;
    maleCount = 0;
    femaleCount = 0;
    malePercentage = 0;
    femalePercentage = 0;
    recentPatients: Patient[] = [];

    constructor(private patientService: PatientService) {}

    ngOnInit(): void {
        this.loadPatients();
    }

    loadPatients(): void {
        this.patientService.getAllPatients().subscribe({
            next: (patients: Patient[]) => {
                this.totalPatients = patients.length;
                
                // Calculate gender distribution
                this.maleCount = patients.filter(p => p.sexe?.toLowerCase() === 'homme' || p.sexe?.toLowerCase() === 'm').length;
                this.femaleCount = patients.filter(p => p.sexe?.toLowerCase() === 'femme' || p.sexe?.toLowerCase() === 'f').length;
                
                if (this.totalPatients > 0) {
                    this.malePercentage = Math.round((this.maleCount / this.totalPatients) * 100);
                    this.femalePercentage = Math.round((this.femaleCount / this.totalPatients) * 100);
                }

                // Get recent patients (last 5)
                this.recentPatients = patients.slice(0, 5);
            },
            error: (err) => console.error('Error loading patients:', err)
        });
    }
}
