import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-doctor-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-doctor-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/doctor'] }]
            },
            {
                label: 'Gestion des Patients',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Liste des Patients', icon: 'pi pi-fw pi-list', routerLink: ['/doctor', 'patients'] },
                    { label: 'Ajouter un Patient', icon: 'pi pi-fw pi-plus', routerLink: ['/doctor', 'patients', 'create'] }
                ]
            },
            {
                label: 'Gestion des Rendez-vous',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    { label: 'Mes Rendez-vous', icon: 'pi pi-fw pi-list', routerLink: ['/doctor', 'appointments'] },
                    { label: 'Créer un Rendez-vous', icon: 'pi pi-fw pi-plus', routerLink: ['/doctor', 'appointments', 'create'] }
                ]
            },
            {
                label: 'Documentation',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/doctor', 'documentation']
                    }
                ]
            }
        ];
    }
}
