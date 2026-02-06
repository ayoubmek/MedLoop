import { Component } from '@angular/core';
import { AdminDashboard } from './components/admin-dashboard';

@Component({
    selector: 'app-dashboard',
    imports: [AdminDashboard],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12">
                <app-admin-dashboard></app-admin-dashboard>
            </div>
        </div>
    `
})
export class Dashboard {}
