import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { MedicalRecord } from '../../models/medical-record.model';
import { MedicalRecordService } from '../../services/medical-record.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  standalone: true,
  selector: 'app-create-medical-record',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="card">
      <h3 class="mb-4">Créer Dossier Médical</h3>

      <div class="mb-3">
        <label class="block text-sm text-muted-color">Patient</label>
        <select class="w-full p-2 border rounded" [(ngModel)]="record.patientId">
          <option [value]="0">Sélectionner un patient</option>
          <option *ngFor="let p of patients" [value]="p.id">{{ p.prenom }} {{ p.nom }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="block text-sm text-muted-color">Résumé / Motif</label>
        <input pInputText class="w-full" [(ngModel)]="record.summary" />
      </div>

      <div class="mb-3">
        <label class="block text-sm text-muted-color">Diagnostic</label>
        <textarea rows="3" class="w-full" [(ngModel)]="record.diagnosis"></textarea>
      </div>

      <div class="mb-3">
        <label class="block text-sm text-muted-color">Notes cliniques</label>
        <textarea rows="5" class="w-full" [(ngModel)]="record.notes"></textarea>
      </div>

      <div class="mb-3">
        <label class="block text-sm text-muted-color">Prescriptions</label>
        <textarea rows="2" class="w-full" [(ngModel)]="record.prescriptions"></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button pButton type="button" class="p-button-secondary" (click)="cancel()">Annuler</button>
        <button pButton type="button" class="p-button-primary" (click)="save()">Enregistrer</button>
      </div>
    </div>
  `
})
export class CreateMedicalRecordComponent implements OnInit {
  record: MedicalRecord = { patientId: 0, summary: '', diagnosis: '', notes: '', prescriptions: '' };
  patients: Patient[] = [];

  constructor(
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error('Error loading patients', err)
    });

    // If route contains patientId preset, use it
    const pid = Number(this.route.snapshot.paramMap.get('patientId'));
    if (pid) this.record.patientId = pid;
  }

  save(): void {
    if (!this.record.patientId) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Sélectionnez un patient' });
      return;
    }

    this.medicalRecordService.createRecord(this.record).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Dossier médical créé' });
        // Navigate back to patient records or patient view
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error creating record', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de créer le dossier médical' });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
