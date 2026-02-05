import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';
import { PatientsListComponent } from './patients/patients-list/patients-list';
import { PatientFormComponent } from './patients/patient-form/patient-form';

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
    { path: '**', redirectTo: '/notfound' }
];

export default routes;
