import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ServicesList } from '../../../services/services-list';
import { MedicalService } from '../../../models/service.model';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class ServicesListComponent implements OnInit {
  services: MedicalService[] = [];
  loading = false;

  constructor(
    private medicalServiceService: ServicesList,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadServices();
  }

 loadServices() {
    this.loading = true;
    
    // Utilisez la nouvelle méthode
    this.medicalServiceService.getAllServicesWithHospital().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement services:', err);
        this.loading = false;
        alert('Erreur lors du chargement des services');
      }
    });
  }


  createService() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onDelete(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.medicalServiceService.deleteService(id).subscribe({
        next: () => {
          alert('Service supprimé avec succès');
          this.loadServices();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression du service');
        }
      });
    }
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAvailabilityColor(service: MedicalService): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    const percentage = (service.availableBeds / service.totalBeds) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warn';
    return 'danger';
  }
}