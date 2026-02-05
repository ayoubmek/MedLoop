import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { HospitalService} from '../../../services/hospital';
import { Hospital, CreateHospitalDto, UpdateHospitalDto } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospital-form',
  templateUrl: './hospital-form.html', 
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FluidModule,
  ]
})
export class HospitalFormComponent implements OnInit {
  hospital: any = {
    id: 0, 
    name: '',
    address: '',
    phone: '',
    email: '',
    services: ''
  };
  
  loading = false;
  @Input() hospitalId?: number; 
  @Input() isEditing = false;

  @Output() save = new EventEmitter<Hospital>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private hospitalService: HospitalService, 
    private router: Router,                  
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;
      this.loadHospital(+id); 
    }
  }

  loadHospital(id: number) {
    this.loading = true;
    this.hospitalService.getHospitalById(id).subscribe({
      next: (h) => {
        this.hospital = {
          ...h,
          services: Array.isArray(h.services) 
            ? h.services.map((s: any) => s.name).join(', ')
            : (h.services || '')
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement hôpital:', err);
        alert('Impossible de charger cet hôpital');
        this.loading = false;
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.hospital.name &&
      this.hospital.address &&
      this.hospital.phone &&
      this.hospital.email
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditing) {
      this.updateHospital();
    } else {
      this.createHospital();
    }
  }

  updateHospital(): void {
    this.loading = true;
    
    if (!this.hospital.id) {
      alert('Erreur: ID de l\'hôpital manquant');
      this.loading = false;
      return;
    }
    
    const hospitalData: UpdateHospitalDto = {
      id: this.hospital.id,
      name: this.hospital.name,
      address: this.hospital.address,
      phone: this.hospital.phone,
      email: this.hospital.email
    };
    
    console.log('📤 Données envoyées:', JSON.stringify(hospitalData, null, 2));
    
    this.hospitalService.updateHospital(hospitalData).subscribe({
      next: (updatedHospital) => {
        console.log('✅ Mise à jour réussie:', updatedHospital);
        alert('Hôpital mis à jour avec succès !');
        this.loading = false;
        
        this.save.emit(updatedHospital);
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        
        if (err.error && err.error.message) {
          alert(`Erreur: ${err.error.message}`);
        } else if (err.error) {
          alert(`Erreur: ${JSON.stringify(err.error)}`);
        } else {
          alert('Erreur lors de la mise à jour de l\'hôpital');
        }
        
        this.loading = false;
      }
    });
  }

  createHospital(): void {
    this.loading = true;
    
    const hospitalData: CreateHospitalDto = {
      name: this.hospital.name,
      address: this.hospital.address,
      phone: this.hospital.phone,
      email: this.hospital.email
    };
    
    console.log('📤 Données création:', JSON.stringify(hospitalData, null, 2));
    
    this.hospitalService.createHospital(hospitalData).subscribe({
      next: (createdHospital) => {
        console.log('Hôpital créé:', createdHospital);
        alert('Hôpital créé avec succès !');
        this.loading = false;
        
        this.save.emit(createdHospital);
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Erreur création hôpital:', err);
        if (err.error && err.error.message) {
          alert(`Erreur: ${err.error.message}`);
        } else {
          alert('Erreur lors de la création de l\'hôpital');
        }
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}