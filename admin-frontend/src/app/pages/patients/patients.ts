import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-patients',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        SelectModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedPatients()" [disabled]="!selectedPatients || !selectedPatients.length" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="patients()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'email']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedPatients"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} patients"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Patients</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="name" style="min-width:16rem">Name <p-sortIcon field="name" /></th>
                    <th pSortableColumn="dateOfBirth">Date of Birth <p-sortIcon field="dateOfBirth" /></th>
                    <th pSortableColumn="address">Address <p-sortIcon field="address" /></th>
                    <th pSortableColumn="phone">Phone <p-sortIcon field="phone" /></th>
                    <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
                    <th pSortableColumn="doctorName">Doctor <p-sortIcon field="doctorName" /></th>
                    <th style="min-width: 8rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-patient let-columns="columns">
                <tr>
                    <td>
                        <p-tableCheckbox [value]="patient" />
                    </td>
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.dateOfBirth | date:'shortDate' }}</td>
                    <td>{{ patient.address }}</td>
                    <td>{{ patient.phone }}</td>
                    <td>{{ patient.email }}</td>
                    <td>{{ patient.doctorName }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" (onClick)="editPatient(patient)" />
                        <p-button icon="pi pi-trash" class="p-button-rounded p-button-warning" (onClick)="deletePatient(patient)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="patientDialog" [style]="{ width: '450px' }" header="Patient Details" [modal]="true" class="p-fluid">
            <ng-template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <input pInputText id="name" [(ngModel)]="patient.name" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="dateOfBirth">Date of Birth</label>
                    <input pInputText type="date" id="dateOfBirth" [(ngModel)]="patient.dateOfBirth" />
                </div>
                <div class="field">
                    <label for="address">Address</label>
                    <input pInputText id="address" [(ngModel)]="patient.address" required="true" />
                </div>
                <div class="field">
                    <label for="phone">Phone</label>
                    <input pInputText id="phone" [(ngModel)]="patient.phone" required="true" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <input pInputText id="email" [(ngModel)]="patient.email" required="true" />
                </div>
                <div class="field">
                    <label for="doctor">Doctor</label>
                    <p-select [options]="doctors()" [(ngModel)]="selectedDoctor" optionLabel="name" optionValue="id" placeholder="Select Doctor" />
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (onClick)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" text (onClick)="savePatient()" />
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
    `
})
export class Patients implements OnInit {
    patients = signal<Patient[]>([]);
    doctors = signal<Doctor[]>([]);
    patientDialog: boolean = false;
    selectedPatients: Patient[] | null = null;
    patient: Patient = {} as Patient;
    selectedDoctor: number | null = null;
    submitted: boolean = false;

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'dateOfBirth', header: 'Date of Birth' },
        { field: 'address', header: 'Address' },
        { field: 'phone', header: 'Phone' },
        { field: 'email', header: 'Email' },
        { field: 'doctorName', header: 'Doctor' }
    ];

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private patientService: PatientService,
        private doctorService: DoctorService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadPatients();
        this.loadDoctors();
    }

    loadPatients() {
        this.patientService.getPatients().subscribe({
            next: (data) => this.patients.set(data),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load patients' })
        });
    }

    loadDoctors() {
        this.doctorService.getDoctors().subscribe({
            next: (data) => this.doctors.set(data),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load doctors' })
        });
    }

    openNew() {
        this.patient = {} as Patient;
        this.selectedDoctor = null;
        this.submitted = false;
        this.patientDialog = true;
    }

    editPatient(patient: Patient) {
        this.patient = { ...patient };
        this.patient.dateOfBirth = new Date(patient.dateOfBirth).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
        this.selectedDoctor = patient.doctorId || null;
        this.patientDialog = true;
    }

    deletePatient(patient: Patient) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + patient.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.patientService.deletePatient(patient.id!).subscribe({
                    next: () => {
                        this.loadPatients();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Deleted' });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete patient' })
                });
            }
        });
    }

    deleteSelectedPatients() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected patients?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Implement bulk delete if needed
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patients Deleted' });
            }
        });
    }

    hideDialog() {
        this.patientDialog = false;
        this.submitted = false;
    }

    savePatient() {
        this.submitted = true;

        if (this.patient.name?.trim()) {
            if (this.patient.id) {
                this.patient.doctorId = this.selectedDoctor || undefined;
                this.patientService.updatePatient(this.patient.id, this.patient).subscribe({
                    next: () => {
                        this.loadPatients();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Updated' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update patient' })
                });
            } else {
                this.patient.doctorId = this.selectedDoctor || undefined;
                this.patientService.createPatient(this.patient).subscribe({
                    next: () => {
                        this.loadPatients();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Patient Created' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create patient' })
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}