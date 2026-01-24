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
import { Doctor } from '../../models/doctor.model';
import { DoctorService } from '../../services/doctor.service';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital.model';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-doctors',
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
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedDoctors()" [disabled]="!selectedDoctors || !selectedDoctors.length" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="doctors()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'specialization', 'email']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedDoctors"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} doctors"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Doctors</h5>
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
                    <th pSortableColumn="specialization">Specialization <p-sortIcon field="specialization" /></th>
                    <th pSortableColumn="licenseNumber">License Number <p-sortIcon field="licenseNumber" /></th>
                    <th pSortableColumn="phone">Phone <p-sortIcon field="phone" /></th>
                    <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
                    <th pSortableColumn="hospitalName">Hospital <p-sortIcon field="hospitalName" /></th>
                    <th style="min-width: 8rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-doctor let-columns="columns">
                <tr>
                    <td>
                        <p-tableCheckbox [value]="doctor" />
                    </td>
                    <td>{{ doctor.name }}</td>
                    <td>{{ doctor.specialization }}</td>
                    <td>{{ doctor.licenseNumber }}</td>
                    <td>{{ doctor.phone }}</td>
                    <td>{{ doctor.email }}</td>
                    <td>{{ doctor.hospitalName }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" (onClick)="editDoctor(doctor)" />
                        <p-button icon="pi pi-trash" class="p-button-rounded p-button-warning" (onClick)="deleteDoctor(doctor)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="doctorDialog" [style]="{ width: '450px' }" header="Doctor Details" [modal]="true" class="p-fluid">
            <ng-template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <input pInputText id="name" [(ngModel)]="doctor.name" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="specialization">Specialization</label>
                    <input pInputText id="specialization" [(ngModel)]="doctor.specialization" required="true" />
                </div>
                <div class="field">
                    <label for="licenseNumber">License Number</label>
                    <input pInputText id="licenseNumber" [(ngModel)]="doctor.licenseNumber" required="true" />
                </div>
                <div class="field">
                    <label for="phone">Phone</label>
                    <input pInputText id="phone" [(ngModel)]="doctor.phone" required="true" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <input pInputText id="email" [(ngModel)]="doctor.email" required="true" />
                </div>
                <div class="field">
                    <label for="hospital">Hospital</label>
                    <p-select [options]="hospitals()" [(ngModel)]="selectedHospital" optionLabel="name" optionValue="id" placeholder="Select Hospital" />
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (onClick)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" text (onClick)="saveDoctor()" />
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
    `
})
export class Doctors implements OnInit {
    doctors = signal<Doctor[]>([]);
    hospitals = signal<Hospital[]>([]);
    doctorDialog: boolean = false;
    selectedDoctors: Doctor[] | null = null;
    doctor: Doctor = {} as Doctor;
    selectedHospital: number | null = null;
    submitted: boolean = false;

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'specialization', header: 'Specialization' },
        { field: 'licenseNumber', header: 'License Number' },
        { field: 'phone', header: 'Phone' },
        { field: 'email', header: 'Email' },
        { field: 'hospitalName', header: 'Hospital' }
    ];

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private doctorService: DoctorService,
        private hospitalService: HospitalService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadDoctors();
        this.loadHospitals();
    }

    loadDoctors() {
        this.doctorService.getDoctors().subscribe({
            next: (data) => this.doctors.set(data),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load doctors' })
        });
    }

    loadHospitals() {
        this.hospitalService.getHospitals().subscribe({
            next: (data) => this.hospitals.set(data),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load hospitals' })
        });
    }

    openNew() {
        this.doctor = {} as Doctor;
        this.selectedHospital = null;
        this.submitted = false;
        this.doctorDialog = true;
    }

    editDoctor(doctor: Doctor) {
        this.doctor = { ...doctor };
        this.selectedHospital = doctor.hospitalId || null;
        this.doctorDialog = true;
    }

    deleteDoctor(doctor: Doctor) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + doctor.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.doctorService.deleteDoctor(doctor.id!).subscribe({
                    next: () => {
                        this.loadDoctors();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Deleted' });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete doctor' })
                });
            }
        });
    }

    deleteSelectedDoctors() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected doctors?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Implement bulk delete if needed
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctors Deleted' });
            }
        });
    }

    hideDialog() {
        this.doctorDialog = false;
        this.submitted = false;
    }

    saveDoctor() {
        this.submitted = true;

        if (this.doctor.name?.trim()) {
            if (this.doctor.id) {
                this.doctor.hospitalId = this.selectedHospital || undefined;
                this.doctorService.updateDoctor(this.doctor.id, this.doctor).subscribe({
                    next: () => {
                        this.loadDoctors();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Updated' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update doctor' })
                });
            } else {
                this.doctor.hospitalId = this.selectedHospital || undefined;
                this.doctorService.createDoctor(this.doctor).subscribe({
                    next: () => {
                        this.loadDoctors();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Created' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create doctor' })
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}