// src/app/pages/hospitals/hospitals-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core'; // ✅ Importe ViewChild
import { Table } from 'primeng/table'; // ✅ Importe la classe Table
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../../services/hospital';
import { Hospital } from '../../../models/hospital.model';
@Component({
  selector: 'app-hospitals-list',
  templateUrl: './hospitals-list.html', // ✅ extension .html
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ],
})
export class HospitalsListComponent implements OnInit {
  hospitals: Hospital[] = [];

  @ViewChild('dt') table!: Table; // ✅ Table est maintenant reconnu

  constructor(private hospitalService: HospitalService,  private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getAllHospitals().subscribe((data: Hospital[]) => {
      this.hospitals = data;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onEdit(id: number) {
  this.router.navigate(['edit', id], { relativeTo: this.route });
}

createHospital() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }


  onDelete(id: number) {
    if (confirm('Supprimer cet hôpital ?')) {
      this.hospitalService.deleteHospital(id).subscribe(() => {
        this.loadHospitals();
      });
    }
  }
  openAddForm() {
  const newHospital: Partial<Hospital> = {
  name: '',
  address: '',
  phone: '',
  email: ''
};
}

openEditForm(hospital: Hospital) {
  // Ouvre en mode édition (avec copie pour ne pas modifier directement la liste)
  const hospitalCopy = { ...hospital };
  // Passe hospitalCopy au formulaire
}
onCreate() {
  this.router.navigate(['new'], { relativeTo: this.route });
}
}