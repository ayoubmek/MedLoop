import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDocument } from '../models/app-document';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class AppDocumentService {
    constructor(private http: HttpClient) { }

    getAllDocuments(): Observable<AppDocument[]> {
        return this.http.get<AppDocument[]>(environment.baseUrl + 'documents');
    }
}
