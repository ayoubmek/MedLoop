export interface Patient {
    id?: number;
    name: string;
    dateOfBirth: string; // ISO date string
    address: string;
    phone: string;
    email: string;
    doctorId?: number;
    doctorName?: string;
}