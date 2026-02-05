import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  styleUrls: ['./patients-list.scss']
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  searchValue: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement patients:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors du chargement des patients' });
      }
    });
  }

  createPatient() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(id: number | undefined) {
    if (id) {
      this.router.navigate(['edit', id], { relativeTo: this.route });
    }
  }

  onDelete(id: number | undefined) {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Patient supprimé avec succès' });
          this.loadPatients();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression du patient' });
        }
      });
    }
  }

  onSearch(event: any) {
    const value = event.target.value;
    if (value && value.length > 0) {
      this.patientService.searchPatients(value).subscribe({
        next: (data) => {
          this.patients = data;
        },
        error: (err) => {
          console.error('Erreur recherche:', err);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la recherche' });
        }
      });
    } else {
      this.loadPatients();
    }
  }
}
