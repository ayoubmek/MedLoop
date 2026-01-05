import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Patients', icon: 'pi pi-users', route: '/patients' },
    { label: 'Dossiers', icon: 'pi pi-folder', route: '/dossiers' },
    { label: 'Appointments', icon: 'pi pi-calendar', route: '/appointments' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' }
  ];
}
