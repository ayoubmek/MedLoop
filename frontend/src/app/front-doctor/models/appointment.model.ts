// src/app/models/appointment.model.ts

import { ServicesList } from '../services/services-list';

export interface Appointment {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  service: ServicesList;
  dateTime: string; // Format ISO: "2025-12-26T10:00:00"
  duration: number; // en minutes
  status: AppointmentStatus;
  bedId?: number;
  createdAt?: string;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export interface AppointmentCreateDTO {
  patientId: number;
  doctorId: number;
  service: {
    id: number;
  };
  dateTime: string;
  duration: number;
  bedId?: number;
}