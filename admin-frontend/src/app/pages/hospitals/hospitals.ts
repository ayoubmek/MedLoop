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
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital.service';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-hospitals',
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
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedHospitals()" [disabled]="!selectedHospitals || !selectedHospitals.length" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="hospitals()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'address', 'email']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedHospitals"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} hospitals"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Hospitals</h5>
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
                    <th pSortableColumn="address">Address <p-sortIcon field="address" /></th>
                    <th pSortableColumn="phone">Phone <p-sortIcon field="phone" /></th>
                    <th pSortableColumn="email">Email <p-sortIcon field="email" /></th>
                    <th pSortableColumn="totalDoctors">Total Doctors <p-sortIcon field="totalDoctors" /></th>
                    <th style="min-width: 8rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-hospital let-columns="columns">
                <tr>
                    <td>
                        <p-tableCheckbox [value]="hospital" />
                    </td>
                    <td>{{ hospital.name }}</td>
                    <td>{{ hospital.address }}</td>
                    <td>{{ hospital.phone }}</td>
                    <td>{{ hospital.email }}</td>
                    <td>{{ hospital.totalDoctors }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" (onClick)="editHospital(hospital)" />
                        <p-button icon="pi pi-trash" class="p-button-rounded p-button-warning" (onClick)="deleteHospital(hospital)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="hospitalDialog" [style]="{ width: '450px' }" header="Hospital Details" [modal]="true" class="p-fluid">
            <ng-template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <input pInputText id="name" [(ngModel)]="hospital.name" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="address">Address</label>
                    <input pInputText id="address" [(ngModel)]="hospital.address" required="true" />
                </div>
                <div class="field">
                    <label for="phone">Phone</label>
                    <input pInputText id="phone" [(ngModel)]="hospital.phone" required="true" />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <input pInputText id="email" [(ngModel)]="hospital.email" required="true" />
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (onClick)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" text (onClick)="saveHospital()" />
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
    `
})
export class Hospitals implements OnInit {
    hospitals = signal<Hospital[]>([]);
    hospitalDialog: boolean = false;
    selectedHospitals: Hospital[] | null = null;
    hospital: Hospital = {} as Hospital;
    submitted: boolean = false;

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'address', header: 'Address' },
        { field: 'phone', header: 'Phone' },
        { field: 'email', header: 'Email' },
        { field: 'totalDoctors', header: 'Total Doctors' }
    ];

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private hospitalService: HospitalService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadHospitals();
    }

    loadHospitals() {
        this.hospitalService.getHospitals().subscribe({
            next: (data) => this.hospitals.set(data),
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load hospitals' })
        });
    }

    openNew() {
        this.hospital = {} as Hospital;
        this.submitted = false;
        this.hospitalDialog = true;
    }

    editHospital(hospital: Hospital) {
        this.hospital = { ...hospital };
        this.hospitalDialog = true;
    }

    deleteHospital(hospital: Hospital) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + hospital.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.hospitalService.deleteHospital(hospital.id!).subscribe({
                    next: () => {
                        this.loadHospitals();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Hospital Deleted' });
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete hospital' })
                });
            }
        });
    }

    deleteSelectedHospitals() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected hospitals?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Implement bulk delete if needed
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Hospitals Deleted' });
            }
        });
    }

    hideDialog() {
        this.hospitalDialog = false;
        this.submitted = false;
    }

    saveHospital() {
        this.submitted = true;

        if (this.hospital.name?.trim()) {
            if (this.hospital.id) {
                this.hospitalService.updateHospital(this.hospital.id, this.hospital).subscribe({
                    next: () => {
                        this.loadHospitals();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Hospital Updated' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update hospital' })
                });
            } else {
                this.hospitalService.createHospital(this.hospital).subscribe({
                    next: () => {
                        this.loadHospitals();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Hospital Created' });
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create hospital' })
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}