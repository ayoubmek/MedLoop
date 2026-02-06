import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="p-fluid p-formgrid p-grid">
            <div class="p-field p-col-12 p-md-4">
                <label for="username">Username</label>
                <input id="username" pInputText [(ngModel)]="username" />
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="email">Email</label>
                <input id="email" pInputText [(ngModel)]="email" />
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="password">Password</label>
                <input id="password" pInputText type="password" [(ngModel)]="password" />
            </div>
            <div class="p-field p-col-12">
                <label for="roles">Roles (comma separated)</label>
                <input id="roles" pInputText [(ngModel)]="roles" />
            </div>
            <div class="p-field p-col-12">
                <button pButton type="button" label="Create User" (click)="create()"></button>
            </div>
        </div>
    `
})
export class AdminUsers {
    username = '';
    email = '';
    password = '';
    roles = '';

    constructor(private keycloak: KeycloakService, private messageService: MessageService) {}

    create() {
        const payload = {
            username: this.username,
            email: this.email,
            password: this.password,
            roles: this.roles ? this.roles.split(',').map(r => r.trim()) : []
        };

        this.keycloak.createUser(payload).subscribe({
            next: () => this.messageService.add({severity:'success', summary:'Success', detail:'User created'}),
            error: (err) => this.messageService.add({severity:'error', summary:'Error', detail:err?.message || 'Failed to create user'})
        });
    }
}
