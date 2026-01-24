// Dans service.model.ts
export interface MedicalService {
  id: number;
  name: string;
  department: string;
  totalBeds: number;
  availableBeds: number;
  
  // Ajoutez ces propriétés
  hospital?: {
    id: number;
    name: string;
    address?: string;
  };
  
  hospitalId?: number; // Si vous avez juste l'ID
}