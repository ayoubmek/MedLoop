    export interface Hospital {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  services?: any[]; 
}

export interface CreateHospitalDto {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateHospitalDto {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

