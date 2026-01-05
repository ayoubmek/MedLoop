import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PatientService } from '../../services/patient';
import { ConsultationService } from '../../services/consultation';
import { DossierService } from '../../services/dossier';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  data: any;
  options: any;
  stats: any[] = [];

  constructor(
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private dossierService: DossierService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initChart();
    this.loadCounts();
  }

  loadCounts() {
    this.stats = [
      { title: 'Patients', value: '0', icon: 'pi pi-users', color: 'blue-500', bg: 'blue-100' },
      { title: 'Appointments', value: '0', icon: 'pi pi-calendar', color: 'orange-500', bg: 'orange-100' },
      { title: 'Dossiers', value: '0', icon: 'pi pi-folder', color: 'cyan-500', bg: 'cyan-100' },
      { title: 'Prescriptions', value: '0', icon: 'pi pi-file', color: 'purple-500', bg: 'purple-100' },
      { title: 'Lab Results', value: '0', icon: 'pi pi-chart-bar', color: 'green-500', bg: 'green-100' },
      { title: 'AI Analyses', value: '0', icon: 'pi pi-cog', color: 'pink-500', bg: 'pink-100' },
      { title: 'Documents', value: '0', icon: 'pi pi-file-pdf', color: 'red-500', bg: 'red-100' }
    ];

    this.patientService.getAllPatients().subscribe({
      next: (data) => this.updateStat('Patients', data.length),
      error: (e) => console.error('Error loading patients', e)
    });

    this.consultationService.getAllConsultations().subscribe({
      next: (data) => this.updateStat('Appointments', data.length),
      error: (e) => console.error('Error loading consultations', e)
    });

    this.dossierService.getAllDossiers().subscribe({
      next: (dossiers) => {
        this.updateStat('Dossiers', dossiers.length);

        let ordonnanceCount = 0;
        let resultatCount = 0;
        let analyseCount = 0;
        let documentCount = 0;

        dossiers.forEach(dossier => {
          if (dossier.ordonnances) ordonnanceCount += dossier.ordonnances.length;
          if (dossier.resultatsExamens) resultatCount += dossier.resultatsExamens.length;
          if (dossier.analyses) analyseCount += dossier.analyses.length;
          if (dossier.documents) documentCount += dossier.documents.length;
        });

        this.updateStat('Prescriptions', ordonnanceCount);
        this.updateStat('Lab Results', resultatCount);
        this.updateStat('AI Analyses', analyseCount);
        this.updateStat('Documents', documentCount);
      },
      error: (e) => console.error('Error loading dossiers', e)
    });
  }

  updateStat(title: string, count: number) {
    const stat = this.stats.find(s => s.title === title);
    if (stat) {
      stat.value = count.toString();
      this.cd.detectChanges();
    }
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'New Patients',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Consultations',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
