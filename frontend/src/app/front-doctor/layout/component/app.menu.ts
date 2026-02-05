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
                label: 'Gestion des Hôpitaux',
                icon: 'pi pi-fw pi-hospital',
                items: [{ label: 'Liste des Hôpitaux', icon: 'pi pi-fw pi-list', routerLink: ['hospitals'] }]
            },
            {
                label: 'Gestion des Services',
                icon: 'pi pi-fw pi-briefcase',
                items: [{ label: 'Liste des Services', icon: 'pi pi-fw pi-list', routerLink: ['services'] }]
            },
            {
                label: 'Gestion des Rendez-vous',
                icon: 'pi pi-fw pi-calendar',
                items: [{ label: 'Liste des Rendez-vous', icon: 'pi pi-fw pi-list', routerLink: ['appointments'] }]
            },
            {
                label: 'Documentation',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['documentation']
                    }
                ]
            }
        ];
    }
}
