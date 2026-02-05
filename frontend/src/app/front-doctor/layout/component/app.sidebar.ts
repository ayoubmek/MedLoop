import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-doctor-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-doctor-menu></app-doctor-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
