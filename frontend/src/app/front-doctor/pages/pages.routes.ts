import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';
import { HospitalsListComponent } from './hospitals/hospitals-list/hospitals-list';
import { HospitalFormComponent } from './hospitals/hospital-form/hospital-form';
import { ServicesListComponent } from './services/services-list/services-list';
import { ServiceFormComponent } from './services/services-form/services-form';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list';
import { AppointmentForm } from './appointments/appointment-form/appointment-form';

export default [
    { path: '', component: Dashboard },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {
        path: 'hospitals',
        children: [
            { path: '', component: HospitalsListComponent },
            { path: 'new', component: HospitalFormComponent },
            { path: 'edit/:id', component: HospitalFormComponent }
        ]
    },
    {
        path: 'services',
        children: [
            { path: '', component: ServicesListComponent },
            { path: 'create', component: ServiceFormComponent },
            { path: 'edit/:id', component: ServiceFormComponent }
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
] as Routes;
