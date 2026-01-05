import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Consultation } from '../../models/consultation';
import { ConsultationService } from '../../services/consultation';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        SelectModule,
        ToastModule,
        ToolbarModule,
        ConfirmDialogModule
    ],
    templateUrl: './appointments.html',
    styleUrl: './appointments.scss',
    providers: [MessageService, ConfirmationService]
})
export class Appointments implements OnInit {
    consultations: Consultation[] = [];
    consultation: Consultation = this.createEmptyConsultation();
    patients: Patient[] = [];
    submitted: boolean = false;
    consultationDialog: boolean = false;
    currentDate: Date | undefined;

    constructor(
        private consultationService: ConsultationService,
        private patientService: PatientService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadConsultations();
        this.loadPatients();
    }

    createEmptyConsultation(): Consultation {
        return {
            dateConsultation: '',
            description: '',
            diagnostic: '',
            motifConsultation: '',
            doctorId: 0,
            doctorName: '',
            patientId: 0
        };
    }

    loadConsultations() {
        this.consultationService.getAllConsultations().subscribe({
            next: (data) => {
                this.consultations = data;
                this.cd.detectChanges();
            },
            error: (e) => {
                console.error('Error loading consultations:', e);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load consultations' });
            }
        });
    }

    loadPatients() {
        this.patientService.getAllPatients().subscribe({
            next: (data) => {
                this.patients = data;
                this.cd.detectChanges();
            },
            error: (e) => console.error('Error loading patients', e)
        });
    }

    getPatientName(consultation: Consultation): string {
        // console.log('Checking consultation:', consultation);

        // Check finding by ID first
        if (consultation.patientId) {
            const patient = this.patients.find(p => p.id == consultation.patientId);
            if (patient) {
                // console.log('Found patient by ID:', patient);
                return `${patient.nom} ${patient.prenom}`;
            } else {
                console.warn(`Patient ID ${consultation.patientId} not found in loaded patients list.`);
            }
        }

        // Check if patient object is directly nested (backend might send it)
        const c = consultation as any;
        if (c.patient) {
            // console.log('Found nested patient:', c.patient);
            return `${c.patient.nom} ${c.patient.prenom}`;
        }

        return consultation.patientId ? consultation.patientId.toString() : '';
    }

    openNew() {
        this.consultation = this.createEmptyConsultation();
        this.currentDate = undefined;
        this.submitted = false;
        this.consultationDialog = true;
    }

    editConsultation(consultation: Consultation) {
        this.consultation = { ...consultation };
        if (this.consultation.dateConsultation) {
            this.currentDate = new Date(this.consultation.dateConsultation);
        }
        this.consultationDialog = true;
    }

    deleteConsultation(consultation: Consultation) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this consultation?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (consultation.id) {
                    this.consultationService.deleteConsultation(consultation.id).subscribe({
                        next: () => {
                            this.consultations = this.consultations.filter(val => val.id !== consultation.id);
                            this.consultation = this.createEmptyConsultation();
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Consultation Deleted', life: 3000 });
                        },
                        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete consultation' })
                    });
                }
            }
        });
    }

    hideDialog() {
        this.consultationDialog = false;
        this.submitted = false;
    }

    saveConsultation() {
        this.submitted = true;

        // Basic validation
        if (this.consultation.motifConsultation?.trim()) {
            // Convert date to ISO string if selected
            if (this.currentDate) {
                this.consultation.dateConsultation = this.currentDate.toISOString();
            }

            if (this.consultation.id) {
                this.consultationService.updateConsultation(this.consultation.id, this.consultation).subscribe({
                    next: (data) => {
                        const index = this.consultations.findIndex(c => c.id === data.id);
                        this.consultations[index] = data;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Consultation Updated', life: 3000 });
                        this.consultationDialog = false;
                        this.consultation = this.createEmptyConsultation();
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' })
                });
            } else {
                this.consultationService.createConsultation(this.consultation).subscribe({
                    next: (data) => {
                        this.consultations.push(data);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Consultation Created', life: 3000 });
                        this.consultationDialog = false;
                        this.consultation = this.createEmptyConsultation();
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed' })
                });
            }
        }
    }
}
