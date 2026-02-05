// src/app/components/appointments/appointment-list/appointment-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Appointments } from '../../../services/appointments';
import { MedicalService } from '../../../models/service.model';
import { ServicesList } from '../../../services/services-list';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  hospitals: Hospital[] = [];
  services: MedicalService[] = [];
  
  selectedHospital: Hospital | null = null;
  selectedService: MedicalService | null = null;

  constructor(
    private appointmentsService: Appointments,
    private servicesList: ServicesList,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadHospitals();
    this.loadServices();
  }

  loadAppointments(): void {
    this.appointmentsService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data;
        console.log('Appointments chargés:', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les rendez-vous'
        });
      }
    });
  }

  loadHospitals(): void {
    this.hospitalService.getAllHospitals().subscribe({
      next: (data) => {
        this.hospitals = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des hôpitaux:', error);
      }
    });
  }

  loadServices(): void {
    this.servicesList.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    });
  }

  onHospitalChange(event: any): void {
    const hospitalId = event.value?.id;
    if (hospitalId) {
      this.appointmentsService.getAppointmentsByHospital(hospitalId).subscribe({
        next: (data) => {
          this.filteredAppointments = data;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de filtrer par hôpital'
          });
        }
      });
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  onServiceChange(event: any): void {
    const serviceId = event.value?.id;
    if (serviceId) {
      this.appointmentsService.getAppointmentsByService(serviceId).subscribe({
        next: (data) => {
          this.filteredAppointments = data;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de filtrer par service'
          });
        }
      });
    } else {
      this.filteredAppointments = this.appointments;
    }
  }

  clearFilters(): void {
    this.selectedHospital = null;
    this.selectedService = null;
    this.filteredAppointments = this.appointments;
  }

  createAppointment(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onCancel(appointment: Appointment): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir annuler ce rendez-vous ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        if (appointment.id) {
          this.appointmentsService.cancelAppointment(appointment.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Rendez-vous annulé avec succès'
              });
              this.loadAppointments();
            },
            error: (error) => {
              console.error('Erreur:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'annuler le rendez-vous"
              });
            }
          });
        }
      }
    });
  }

  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.appointmentsService.deleteAppointment(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Rendez-vous supprimé avec succès'
            });
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Erreur:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer le rendez-vous'
            });
          }
        });
      }
    });
  }

  onGlobalFilter(table: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    table.filterGlobal(inputElement.value, 'contains');
  }

  getStatusSeverity(status: AppointmentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'success';
    case AppointmentStatus.PENDING:
      return 'warn';  // Note: 'warn' au lieu de 'warning'
    case AppointmentStatus.CANCELLED:
      return 'danger';
    case AppointmentStatus.COMPLETED:
      return 'info';
    case AppointmentStatus.NO_SHOW:
      return 'contrast';  // Note: 'contrast' au lieu de 'secondary'
    default:
      return 'secondary';
  }
}
  getStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'Confirmé';
    case AppointmentStatus.PENDING:
      return 'En attente';
    case AppointmentStatus.CANCELLED:
      return 'Annulé';
    case AppointmentStatus.COMPLETED:
      return 'Terminé';
    case AppointmentStatus.NO_SHOW:
      return 'Absent';
    default:
      // Cast to string to handle any unexpected values
      return String(status);
  }
}

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}