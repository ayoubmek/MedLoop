import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  items: MenuItem[] | undefined;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Patients',
        icon: 'pi pi-users',
        routerLink: '/patients'
      }
    ];
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
