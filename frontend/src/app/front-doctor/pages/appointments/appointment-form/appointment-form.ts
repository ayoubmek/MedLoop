import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
//import { CalendarModule } from 'primeng/calendar';
//import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Appointments } from '../../../services/appointments';
import { ServicesList } from '../../../services/services-list';
import { MedicalService } from '../../../models/service.model';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-appointment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    //CalendarModule,
    //DropdownModule,
    InputNumberModule,
    ToastModule
  ],
    providers: [MessageService],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss'
})
export class AppointmentForm implements OnInit {
appointmentForm!: FormGroup;
  services: MedicalService[] = [];
  statuses = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Confirmé', value: 'CONFIRMED' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'Annulé', value: 'CANCELLED' },
    { label: 'Absent', value: 'NO_SHOW' }
  ];
  
  isEditMode = false;
  appointmentId: number | null = null;
  loading = false;
  minDate: Date = new Date();
  loggedInDoctorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentsService: Appointments,
    private servicesService: ServicesList,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

ngOnInit(): void {
  // Get the logged-in doctor ID from auth service
  const profile = this.authService.userProfile;
  if (profile && profile.sub) {
    // Try to extract doctor ID from profile - adjust based on your auth token structure
    // If doctor ID is not in the token, you may need to fetch it from a service
    console.log('User profile:', profile);
  }

  this.initForm();
  
  this.route.params.subscribe(params => {
    if (params['id']) {
      this.isEditMode = true;
      this.appointmentId = +params['id'];
      this.loadAppointment(this.appointmentId);
    } else {
      this.isEditMode = false;
    }
  });
}

  initForm(): void {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      dateTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(15)]],
      status: [null, Validators.required]
    });
  }

  loadServices(): void {
    this.servicesService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log('Services chargés:', this.services);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    });
  }

loadAppointment(id: number): void {
  this.appointmentsService.getAppointmentById(id).subscribe({
    next: (appointment: Appointment) => {
      console.log('Appointment chargé:', appointment);
      
      // Convertir la date ISO en format datetime-local
      let formattedDate = '';
      if (appointment.dateTime) {
        const dateTime = new Date(appointment.dateTime);
        if (!isNaN(dateTime.getTime())) {
          formattedDate = this.formatDateForInput(dateTime);
          console.log('Date formatée pour input:', formattedDate);
        }
      }
      
      console.log('Statut de l\'appointment:', appointment.status);
      
      this.appointmentForm.patchValue({
        patientId: appointment.patientId,
        dateTime: formattedDate,
        duration: appointment.duration,
        status: appointment.status
      });
      
      console.log('Form values après patch:', this.appointmentForm.value);
    },
    error: (error) => {
      console.error('Erreur lors du chargement du rendez-vous:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger le rendez-vous'
      });
      this.router.navigate(['..'] , { relativeTo: this.route });
    }
  });
}

onSubmit(): void {
  if (this.appointmentForm.invalid) {
    Object.keys(this.appointmentForm.controls).forEach(key => {
      this.appointmentForm.get(key)?.markAsTouched();
    });
    this.messageService.add({
      severity: 'warn',
      summary: 'Attention',
      detail: 'Veuillez remplir tous les champs obligatoires'
    });
    return;
  }

  this.loading = true;
  const formValue = this.appointmentForm.value;
  
  // ✅ Gérer correctement la conversion de date
  let formattedDateTime: string;
  
  if (formValue.dateTime instanceof Date) {
    formattedDateTime = formValue.dateTime.toISOString().slice(0, 19);
  } else if (typeof formValue.dateTime === 'string') {
    if (formValue.dateTime.includes('T')) {
      formattedDateTime = formValue.dateTime + ':00';
    } else {
      const date = new Date(formValue.dateTime);
      if (isNaN(date.getTime())) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Format de date invalide'
        });
        this.loading = false;
        return;
      }
      formattedDateTime = date.toISOString().slice(0, 19);
    }
  } else {
    const date = new Date(formValue.dateTime);
    if (isNaN(date.getTime())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Format de date invalide'
      });
      this.loading = false;
      return;
    }
    formattedDateTime = date.toISOString().slice(0, 19);
  }

  // ✅ CORRECTION : Vérifier et extraire l'ID du service correctement
  
  const appointmentData: any = {
    patientId: formValue.patientId,
    doctorId: 1, // Use logged-in doctor ID - TODO: Get from auth service
    dateTime: formattedDateTime,
    duration: formValue.duration,
    status: formValue.status
  };

  console.log('Données à envoyer:', appointmentData);

  if (this.isEditMode && this.appointmentId) {
    // Mise à jour
    this.appointmentsService.updateAppointment(this.appointmentId, appointmentData).subscribe({
      next: (response) => {
        console.log('Rendez-vous mis à jour:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Rendez-vous mis à jour avec succès'
        });
        setTimeout(() => {
          this.router.navigate(['..'] , { relativeTo: this.route });
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.error?.error || 'Impossible de mettre à jour le rendez-vous'
        });
      }
    });
  } else {
    // Création
    this.appointmentsService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Rendez-vous créé:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Rendez-vous créé avec succès'
        });
        setTimeout(() => {
          this.router.navigate(['..'] , { relativeTo: this.route });
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: error.error?.error || 'Impossible de créer le rendez-vous'
        });
      }
    });
  }
}

  onCancel(): void {
    this.router.navigate(['..'] , { relativeTo: this.route });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // ✅ Méthode helper pour formater la date en format datetime-local
  private formatDateForInput(date: Date): string {
    // S'assurer que c'est un objet Date valide
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Format requis par datetime-local: YYYY-MM-DDTHH:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // ✅ Pour l'attribut min du datetime-local
  getMinDateTime(): string {
    const now = new Date();
    return this.formatDateForInput(now);
  }
}
