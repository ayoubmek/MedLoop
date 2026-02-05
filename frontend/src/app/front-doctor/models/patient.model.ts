export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  sexe?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  doctor?: any;
}
