// app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { HospitalsListComponent } from './app/pages/hospitals/hospitals-list/hospitals-list';
import { HospitalFormComponent } from './app/pages/hospitals/hospital-form/hospital-form';
import { ServicesListComponent } from './app/pages/services/services-list/services-list';
import { ServiceFormComponent } from './app/pages/services/services-form/services-form';
import { AppointmentListComponent } from './app/pages/appointments/appointment-list/appointment-list';
import { AppointmentForm } from './app/pages/appointments/appointment-form/appointment-form';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
      { path: 'documentation', component: Documentation },
      { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
      
      // ✅ Routes pour les hôpitaux
      {
        path: 'hospitals',
        children: [
          { path: '', component: HospitalsListComponent },       // → /hospitals
          { path: 'new', component: HospitalFormComponent },     // → /hospitals/new
          { path: 'edit/:id', component: HospitalFormComponent } // → /hospitals/edit/3
        ]
      }, // ⚠️ Virgule importante ici

      // ✅ Routes pour les services
      {
        path: 'services',
        children: [
          { path: '', component: ServicesListComponent },        // → /services
          { path: 'create', component: ServiceFormComponent },   // → /services/create
          { path: 'edit/:id', component: ServiceFormComponent }  // → /services/edit/4
        ]
      },
      {
        path: 'appointments',
        children: [
          { path: '', component: AppointmentListComponent },        // → /services
          { path: 'create', component: AppointmentForm },   // → /services/create
          { path: 'edit/:id', component: AppointmentForm }  // → /services/edit/4
        ]
      },
    ]
  }
];