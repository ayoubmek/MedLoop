import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../../services/statistics.service';
import { Statistics } from '../../../models/statistics.model';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Doctors</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats().totalDoctors }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-md text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Total </span>
                <span class="text-muted-color">registered doctors</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Patients</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats().totalPatients }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Total </span>
                <span class="text-muted-color">registered patients</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Hospitals</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats().totalHospitals }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-building text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Total </span>
                <span class="text-muted-color">hospitals</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">System</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Active</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-purple-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">MedLoop </span>
                <span class="text-muted-color">Admin System</span>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {
    stats = signal<Statistics>({ totalDoctors: 0, totalPatients: 0, totalHospitals: 0 });

    constructor(private statisticsService: StatisticsService) {}

    ngOnInit() {
        this.loadStatistics();
    }

    loadStatistics() {
        this.statisticsService.getOverallStatistics().subscribe({
            next: (data) => this.stats.set(data),
            error: (error) => console.error('Failed to load statistics', error)
        });
    }
}
