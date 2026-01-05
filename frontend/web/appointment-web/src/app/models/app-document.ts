export interface AppDocument {
    id?: number;
    nom: string;
    type: string;
    cheminUpload: string;
    dateUpload: string;
    accesConfirmePatient: boolean;
    dossierId?: number;
}
