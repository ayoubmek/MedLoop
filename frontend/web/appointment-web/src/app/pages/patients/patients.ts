import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient';

@Component({
  selector: 'app-patients',
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
    ConfirmDialogModule
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.scss',
  providers: [MessageService, ConfirmationService]
})
export class Patients implements OnInit {
  patients: Patient[] = [];
  patient: Patient = { nom: '', prenom: '', cin: '', telephone: '' };
  submitted: boolean = false;
  patientDialog: boolean = false;

  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        console.log('Patients loaded:', data);
        this.patients = data;
        this.cd.detectChanges();
      },
      error: (e) => {
        console.error('Error loading patients:', e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load patients' });
      }
    });
  }

  openNew() {
    this.patient = { nom: '', prenom: '', cin: '', telephone: '' };
    this.submitted = false;
    this.patientDialog = true;
  }

  editPatient(patient: Patient) {
    this.patient = { ...patient };
    this.patientDialog = true;
  }

  deletePatient(patient: Patient) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + patient.nom + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (patient.id) {
          this.patientService.deletePatient(patient.id).subscribe({
            next: () => {
              this.patients = this.patients.filter(val => val.id !== patient.id);
              this.patient = { nom: '', prenom: '', cin: '', telephone: '' };
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted', life: 3000 });
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete patient' })
          });
        }
      }
    });
  }

  hideDialog() {
    this.patientDialog = false;
    this.submitted = false;
  }

  savePatient() {
    this.submitted = true;

    if (this.patient.nom?.trim()) {
      if (this.patient.id) {
        this.patientService.updatePatient(this.patient.id, this.patient).subscribe({
          next: (data) => {
            const index = this.patients.findIndex(p => p.id === data.id);
            this.patients[index] = data;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Updated', life: 3000 });
            this.patientDialog = false;
            this.patient = { nom: '', prenom: '', cin: '', telephone: '' };
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' })
        });
      } else {
        this.patientService.createPatient(this.patient).subscribe({
          next: (data) => {
            this.patients.push(data);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Created', life: 3000 });
            this.patientDialog = false;
            this.patient = { nom: '', prenom: '', cin: '', telephone: '' };
          },
          error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed' })
        });
      }
    }
  }
}
