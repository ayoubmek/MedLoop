import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { MedicalRecord } from '../../models/medical-record.model';
import { MedicalRecordService } from '../../services/medical-record.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  standalone: true,
  selector: 'app-view-medical-record',
  imports: [CommonModule, RouterModule, FormsModule, TableModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3>Dossiers Médicaux</h3>
        <div>
          <button pButton class="p-button-sm" (click)="refresh()">Rafraîchir</button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm text-muted-color">Sélectionner Patient</label>
        <select class="w-full p-2 border rounded" [(ngModel)]="selectedPatientId" (change)="loadRecords()">
          <option [value]="0">-- Sélectionner --</option>
          <option *ngFor="let p of patients" [value]="p.id">{{ p.prenom }} {{ p.nom }}</option>
        </select>
      </div>

      <div *ngIf="records.length === 0" class="text-center py-10 text-muted-color">Aucun dossier médical</div>

      <div *ngIf="records.length > 0">
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="text-left border-b">
              <th class="p-2">Date</th>
              <th class="p-2">Résumé</th>
              <th class="p-2">Diagnostic</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of records" class="border-b hover:bg-surface-50">
              <td class="p-2">{{ r.createdAt | date:'short' }}</td>
              <td class="p-2">{{ r.summary }}</td>
              <td class="p-2">{{ r.diagnosis }}</td>
              <td class="p-2">
                <button pButton class="p-button-text p-button-sm" (click)="view(r)">Voir</button>
                <button pButton class="p-button-text p-button-sm" (click)="edit(r)">Modifier</button>
                <button pButton class="p-button-text p-button-sm" (click)="remove(r)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Simple viewer modal replacement: inline details -->
      <div *ngIf="currentRecord" class="mt-6 p-4 border rounded bg-surface-50">
        <h4 class="mb-2">Détail du dossier</h4>
        <p><strong>Patient:</strong> {{ getPatientName(currentRecord.patientId) }}</p>
        <p><strong>Date:</strong> {{ currentRecord.createdAt | date:'full' }}</p>
        <p><strong>Résumé:</strong> {{ currentRecord.summary }}</p>
        <p><strong>Diagnostic:</strong> {{ currentRecord.diagnosis }}</p>
        <p><strong>Notes:</strong></p>
        <div class="whitespace-pre-line">{{ currentRecord.notes }}</div>
        <p *ngIf="currentRecord.prescriptions"><strong>Prescriptions:</strong> {{ currentRecord.prescriptions }}</p>
      </div>
    </div>
  `
})
export class ViewMedicalRecordComponent implements OnInit {
  records: MedicalRecord[] = [];
  patients: Patient[] = [];
  selectedPatientId = 0;
  currentRecord?: MedicalRecord;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe({
      next: (p) => {
        this.patients = p;
        const pid = Number(this.route.snapshot.paramMap.get('patientId'));
        if (pid) {
          this.selectedPatientId = pid;
          this.loadRecords();
        }
      },
      error: (err) => console.error('Error loading patients', err)
    });
  }

  loadRecords(): void {
    if (!this.selectedPatientId) {
      this.records = [];
      return;
    }
    this.medicalRecordService.getRecordsByPatient(this.selectedPatientId).subscribe({
      next: (data) => {
        this.records = data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      },
      error: (err) => console.error('Error loading records', err)
    });
  }

  view(r: MedicalRecord): void {
    this.currentRecord = r;
  }

  edit(r: MedicalRecord): void {
    // For simplicity, navigate to create with record id or open an edit component
    this.router.navigate(['/front-doctor/medical-records/edit', r.id]);
  }

  remove(r: MedicalRecord): void {
    if (!r.id) return;
    if (!confirm('Supprimer ce dossier médical ?')) return;
    this.medicalRecordService.deleteRecord(r.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Dossier supprimé' });
        this.loadRecords();
      },
      error: (err) => {
        console.error('Error deleting record', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer' });
      }
    });
  }

  refresh(): void {
    this.loadRecords();
  }

  getPatientName(id?: number): string {
    const p = this.patients.find(x => x.id === id);
    return p ? `${p.prenom} ${p.nom}` : `Patient ${id}`;
  }
}
