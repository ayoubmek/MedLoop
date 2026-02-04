// services-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ServicesList } from '../../../services/services-list';
import { HospitalService } from '../../../services/hospital';
import { MedicalService } from '../../../models/service.model';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-service-form',
  templateUrl: './services-form.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule
  ]
})
export class ServiceFormComponent implements OnInit {
  service: MedicalService = {
    id: 0,
    name: '',
    department: '',
    totalBeds: 0,
    availableBeds: 0,
    hospital: { id: 0, name: '' }
  };

  hospitals: Hospital[] = [];
  selectedHospitalId: number = 0;
  isEditing = false;
  loading = false;

  constructor(
    private serviceService: ServicesList,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadHospitals();
    
    // Vérifier si on est en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadService(+id);
    }
  }

  loadHospitals() {
    this.hospitalService.getAllHospitals().subscribe({
      next: (data: Hospital[]) => {
        this.hospitals = data;
        console.log('Hôpitaux chargés:', data);
      },
      error: (err: any) => {
        console.error('Erreur chargement hôpitaux:', err);
        alert('Erreur lors du chargement des hôpitaux');
      }
    });
  }

  loadService(id: number) {
    this.loading = true;
    this.serviceService.getServiceById(id).subscribe({
      next: (data: MedicalService) => {
        this.service = data;
        this.selectedHospitalId = data.hospital?.id ?? 0;
        this.loading = false;
        console.log('Service chargé:', data);
      },
      error: (err: any) => {
        console.error('Erreur chargement service:', err);
        alert('Erreur lors du chargement du service');
        this.loading = false;
        this.router.navigate(['/services']);
      }
    });
  }

onSubmit() {
    console.log('=== DÉBUT SOUMISSION ===');
    console.log('selectedHospitalId:', this.selectedHospitalId);
    console.log('Type:', typeof this.selectedHospitalId);
    console.log('Service actuel:', this.service);
    
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires correctement');
      return;
    }

    // Convertir selectedHospitalId en number
    const hospitalId = typeof this.selectedHospitalId === 'string' 
      ? parseInt(this.selectedHospitalId) 
      : this.selectedHospitalId;

    console.log('Hospital ID après conversion:', hospitalId);

    // Trouver l'hôpital sélectionné
    const selectedHospital = this.hospitals.find(h => h.id === hospitalId);

    console.log('Hôpital trouvé:', selectedHospital);

    if (!selectedHospital) {
      alert('Veuillez sélectionner un hôpital valide');
      return;
    }

    const serviceToSend: any = {
    id: this.isEditing ? this.service.id : 0,
    name: this.service.name,
    department: this.service.department,
    totalBeds: this.service.totalBeds,
    availableBeds: this.service.availableBeds,
    hospital: {
      id: selectedHospital.id // UNIQUEMENT l'ID, pas le nom
    }
  };

  console.log('Service à envoyer:', JSON.stringify(serviceToSend, null, 2));

    console.log('Service à envoyer:', JSON.stringify(serviceToSend, null, 2));

    this.loading = true;

    if (this.isEditing) {
      // Mise à jour
      this.serviceService.updateService(this.service.id, serviceToSend).subscribe({
        next: (response) => {
          console.log('Réponse mise à jour:', response);
          alert('Service mis à jour avec succès');
          this.router.navigate(['/services']);
        },
        error: (err: any) => {
          console.error('Erreur complète:', err);
          console.error('Status:', err.status);
          console.error('Error object:', err.error);
          
          let errorMessage = 'Erreur lors de la mise à jour du service';
          
          if (err.error) {
            if (typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.error) {
              errorMessage = err.error.error;
            } else {
              errorMessage = JSON.stringify(err.error);
            }
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          alert(errorMessage);
          this.loading = false;
        }
      });
    } else {
      // Création
      this.serviceService.createService(serviceToSend).subscribe({
        next: (response) => {
          console.log('Réponse création:', response);
          alert('Service créé avec succès');
          this.router.navigate(['/services']);
        },
        error: (err: any) => {
          console.error('Erreur complète:', err);
          console.error('Status:', err.status);
          console.error('Error object:', err.error);
          
          let errorMessage = 'Erreur lors de la création du service';
          
          if (err.error) {
            if (typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.error) {
              errorMessage = err.error.error;
            } else {
              errorMessage = JSON.stringify(err.error);
            }
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          alert(errorMessage);
          this.loading = false;
        }
      });
    }
  }


  onCancel() {
    this.router.navigate(['/services']);
  }

  isFormValid(): boolean {
    // Convertir en number pour la validation
    const hospitalId = typeof this.selectedHospitalId === 'string' 
      ? parseInt(this.selectedHospitalId) 
      : this.selectedHospitalId;

    const isValid = !!(
      this.service.name.trim() &&
      this.service.department.trim() &&
      this.service.totalBeds >= 0 &&
      this.service.availableBeds >= 0 &&
      this.service.availableBeds <= this.service.totalBeds &&
      hospitalId > 0 &&
      !isNaN(hospitalId)
    );

    console.log('Form valid:', isValid, 'Hospital ID:', hospitalId);
    return isValid;
  }
}