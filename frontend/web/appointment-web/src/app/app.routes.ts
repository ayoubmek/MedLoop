import { Routes } from '@angular/router';

import { Login } from './pages/login/login';

import { Patients } from './pages/patients/patients';

import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
            { path: 'patients', component: Patients },
            { path: 'appointments', loadComponent: () => import('./pages/appointments/appointments').then(m => m.Appointments) },
            { path: 'dossiers', loadComponent: () => import('./pages/dossiers/dossiers').then(m => m.Dossiers) },
            { path: 'dossiers/:id', loadComponent: () => import('./pages/dossier-details/dossier-details').then(m => m.DossierDetails) }
        ]
    }
];
