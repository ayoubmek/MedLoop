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

  constructor(
    private fb: FormBuilder,
    private appointmentsService: Appointments,
    private servicesService: ServicesList,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

ngOnInit(): void {
  this.initForm();
  
  this.route.params.subscribe(params => {
    if (params['id']) {
      this.isEditMode = true;
      this.appointmentId = +params['id'];
      // Charger les services (qui chargera l'appointment en mode édition)
      this.loadServices();
    } else {
      this.isEditMode = false;
      // ✅ Mode création : NE PAS définir de statut par défaut
      // Le statut sera défini par l'utilisateur via le formulaire HTML
      this.loadServices();
    }
  });
}

  initForm(): void {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required, Validators.min(1)]],
      doctorId: ['', [Validators.required, Validators.min(1)]],
      service: [null, Validators.required],
      dateTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(15)]], // ✅ Pas de valeur par défaut
      bedId: [null],
      status: [null, Validators.required] // ✅ Pas de valeur par défaut
    });
  }

  loadServices(): void {
    this.servicesService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log('Services chargés:', this.services);
        
        // ✅ Si on est en mode édition, charger l'appointment maintenant que les services sont disponibles
        if (this.isEditMode && this.appointmentId) {
          this.loadAppointment(this.appointmentId);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les services'
        });
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
      
      // CORRECTION : Utiliser un type assertion
      const appointmentService = appointment.service as unknown as MedicalService;
      
      let selectedService = null;
      if (appointmentService && appointmentService.id) {
        selectedService = this.services.find(s => s.id === appointmentService.id);
      }
      
      console.log('Service sélectionné:', selectedService);
      console.log('Statut de l\'appointment:', appointment.status);
      
      this.appointmentForm.patchValue({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        service: selectedService || appointmentService,
        dateTime: formattedDate,
        duration: appointment.duration,
        bedId: appointment.bedId,
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
      this.router.navigate(['..'] , { relativeTo: this.route }); // Rediriger vers la liste des rendez-vous
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
  const serviceId = formValue.service?.id;
  
  if (!serviceId) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Veuillez sélectionner un service valide'
    });
    this.loading = false;
    return;
  }

  const appointmentData = {
    patientId: formValue.patientId,
    doctorId: formValue.doctorId,
    service: {
      id: serviceId  // ✅ Utiliser la variable extraite
    },
    dateTime: formattedDateTime,
    duration: formValue.duration,
    bedId: formValue.bedId,
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
