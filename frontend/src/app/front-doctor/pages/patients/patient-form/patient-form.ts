import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Button,
    InputText,
    DatePicker,
    Select,
    Toast
  ],
  providers: [MessageService],
  styleUrls: ['./patient-form.scss']
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  loading = false;
  patientId: number | null = null;
  sexeOptions = [
    { label: 'Homme', value: 'M' },
    { label: 'Femme', value: 'F' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.patientId = params['id'];
        this.loadPatient(params['id']);
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]*$/)]],
      dateNaissance: ['', Validators.required],
      sexe: [''],
      adresse: [''],
      codePostal: [''],
      ville: ['']
    });
  }

  loadPatient(id: number) {
    this.loading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.form.patchValue({
          ...patient,
          dateNaissance: new Date(patient.dateNaissance)
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement patient:', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le patient' });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Avertissement', detail: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    const patient: Patient = this.form.value;
    const dateNaissance = patient.dateNaissance as any;
    if (dateNaissance && typeof dateNaissance === 'object' && dateNaissance instanceof Date) {
      patient.dateNaissance = dateNaissance.toISOString().split('T')[0];
    }

    this.loading = true;

    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(this.patientId, patient).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Patient mis à jour avec succès' });
          this.loading = false;
          setTimeout(() => this.router.navigate(['/doctor/patients']), 1500);
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour du patient' });
          this.loading = false;
        }
      });
    } else {
      this.patientService.createPatient(patient).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Patient créé avec succès' });
          this.loading = false;
          setTimeout(() => this.router.navigate(['/doctor/patients']), 1500);
        },
        error: (err) => {
          console.error('Erreur création:', err);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la création du patient' });
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/doctor/patients']);
  }
}