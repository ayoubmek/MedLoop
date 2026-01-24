export interface Doctor {
    id?: number;
    name: string;
    specialization: string;
    licenseNumber: string;
    phone: string;
    email: string;
    hospitalId?: number;
    hospitalName?: string;
}