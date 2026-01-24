import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Doctors } from './doctors/doctors';
import { Patients } from './patients/patients';
import { Hospitals } from './hospitals/hospitals';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'doctors', component: Doctors },
    { path: 'patients', component: Patients },
    { path: 'hospitals', component: Hospitals },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
