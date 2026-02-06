export interface MedicalRecord {
  id?: number;
  patientId: number;
  doctorId?: number;
  summary?: string; // short summary / motif
  diagnosis?: string;
  notes?: string; // detailed clinical notes
  prescriptions?: string; // free text or structured string
  attachments?: Array<{ url: string; filename?: string }>;
  createdAt?: string;
  updatedAt?: string;
}
