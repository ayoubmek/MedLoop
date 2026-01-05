import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Dossier } from '../../models/dossier';
import { DossierService } from '../../services/dossier';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    SelectModule,
    TooltipModule
  ],
  templateUrl: './dossiers.html',
  styleUrl: './dossiers.scss',
  providers: [MessageService, ConfirmationService]
})
export class Dossiers implements OnInit {
  dossiers: Dossier[] = [];
  patients: Patient[] = [];
  patientOptions: any[] = [];
  dossier: Dossier = { type: '', notes: '', patientId: 0 };
  submitted: boolean = false;
  dossierDialog: boolean = false;

  constructor(
    private dossierService: DossierService,
    private patientService: PatientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPatients();
    this.loadDossiers();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe(data => {
      this.patients = data;
      this.patientOptions = data.map(p => ({
        label: `${p.nom} ${p.prenom}`,
        value: p.id
      }));
      console.log('Patients loaded:', this.patients);
      console.log('Patient options:', this.patientOptions);
    });
  }

  loadDossiers() {
    console.log('Loading dossiers from API...');
    this.dossierService.getAllDossiers().subscribe({
      next: (data) => {
        console.log('Dossiers received from API:', data);
        this.dossiers = data;
        console.log('Dossiers array updated:', this.dossiers);
        this.cd.detectChanges();
      },
      error: (e) => {
        console.error('Error loading dossiers:', e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load dossiers' });
      }
    });
  }

  getPatientName(id: number): string {
    const p = this.patients.find(x => x.id === id);
    return p ? `${p.nom} ${p.prenom}` : 'Unknown';
  }

  viewDossier(dossier: Dossier) {
    this.router.navigate(['/dossiers', dossier.id]);
  }

  openNew() {
    this.dossier = { type: '', notes: '', patientId: 0 };
    this.submitted = false;
    this.dossierDialog = true;
  }

  editDossier(dossier: Dossier) {
    this.dossier = { ...dossier };
    this.dossierDialog = true;
  }

  deleteDossier(dossier: Dossier) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete dossier ' + dossier.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (dossier.id) {
          this.dossierService.deleteDossier(dossier.id).subscribe({
            next: () => {
              this.dossiers = this.dossiers.filter(val => val.id !== dossier.id);
              this.dossier = { type: '', notes: '', patientId: 0 };
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dossier Deleted', life: 3000 });
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete dossier' })
          });
        }
      }
    });
  }

  hideDialog() {
    this.dossierDialog = false;
    this.submitted = false;
  }

  saveDossier() {
    this.submitted = true;

    if (this.dossier.type?.trim()) {
      if (this.dossier.id) {
        this.dossierService.updateDossier(this.dossier.id, this.dossier).subscribe({
          next: (data) => {
            const index = this.dossiers.findIndex(d => d.id === data.id);
            this.dossiers[index] = data;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dossier Updated', life: 3000 });
            this.dossierDialog = false;
            this.dossier = { type: '', notes: '', patientId: 0 };
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' })
        });
      } else {
        this.dossierService.createDossier(this.dossier).subscribe({
          next: (data) => {
            this.dossiers.push(data);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dossier Created', life: 3000 });
            this.dossierDialog = false;
            this.dossier = { type: '', notes: '', patientId: 0 };
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed' })
        });
      }
    }
  }
}
