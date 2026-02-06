import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';
import { PatientsListComponent } from './patients/patients-list/patients-list';
import { PatientFormComponent } from './patients/patient-form/patient-form';
import { CreateMedicalRecordComponent } from './medical-records/create-medical-record';
import { ViewMedicalRecordComponent } from './medical-records/view-medical-record';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {
        path: 'patients',
        children: [
            { path: '', component: PatientsListComponent },
            { path: 'create', component: PatientFormComponent },
            { path: 'edit/:id', component: PatientFormComponent }
        ]
    },
    {
        path: 'appointments',
        children: [
            { path: '', component: AppointmentListComponent },
            { path: 'create', component: AppointmentForm },
            { path: 'edit/:id', component: AppointmentForm }
        ]
    },
    {
        path: 'medical-records',
        children: [
            { path: '', component: ViewMedicalRecordComponent },
            { path: 'create/:patientId', component: CreateMedicalRecordComponent },
            { path: 'create', component: CreateMedicalRecordComponent },
            { path: 'patient/:patientId', component: ViewMedicalRecordComponent },
            { path: 'edit/:id', component: CreateMedicalRecordComponent }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];

export default routes;
