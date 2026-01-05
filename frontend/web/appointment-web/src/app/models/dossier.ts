import { Ordonnance } from './ordonnance';
import { ResultatExamen } from './resultat-examen';
import { AppDocument } from './app-document';
import { AnalysePredictive } from './analyse-predictive';

export interface Dossier {
    id?: number;
    type: string;
    notes: string;
    patientId: number;
    ordonnances?: Ordonnance[];
    resultatsExamens?: ResultatExamen[];
    documents?: AppDocument[];
    analyses?: AnalysePredictive[];
}
