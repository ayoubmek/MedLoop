import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { Dossier } from '../../models/dossier';
import { DossierService } from '../../services/dossier';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-dossier-details',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TableModule,
        TagModule,
        DividerModule,
        TooltipModule
    ],
    templateUrl: './dossier-details.html',
    styleUrl: './dossier-details.scss'
})
export class DossierDetails implements OnInit {
    dossier: Dossier | null = null;
    patient: Patient | null = null;
    dossierId: number = 0;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dossierService: DossierService,
        private patientService: PatientService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.dossierId = +params['id'];
            this.loadDossierDetails();
        });
    }

    loadDossierDetails() {
        this.loading = true;
        this.dossierService.getDossierById(this.dossierId).subscribe({
            next: (data) => {
                console.log('Dossier details loaded:', data);
                this.dossier = data;
                this.loading = false;
                this.cdr.detectChanges();

                if (data.patientId) {
                    this.loadPatient(data.patientId);
                }
            },
            error: (e) => {
                console.error('Error loading dossier:', e);
                this.loading = false;
            }
        });
    }

    loadPatient(patientId: number) {
        this.patientService.getPatientById(patientId).subscribe({
            next: (data) => {
                console.log('Patient loaded:', data);
                this.patient = data;
                this.cdr.detectChanges();
            },
            error: (e) => {
                console.error('Error loading patient:', e);
                this.loading = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/dossiers']);
    }

    getSeverity(resultat: string): string {
        switch (resultat?.toLowerCase()) {
            case 'faible':
                return 'success';
            case 'modéré':
                return 'warn';
            case 'élevé':
                return 'danger';
            default:
                return 'info';
        }
    }

    exportToPDF() {
        if (!this.dossier) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 20;

        // Header with MedLoop branding
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('MedLoop', 14, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Medical Records Management System', 14, 28);

        // Date
        const today = new Date().toLocaleDateString('fr-FR');
        doc.setFontSize(9);
        doc.text(`Generated: ${today}`, pageWidth - 14, 28, { align: 'right' });

        yPos = 45;

        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Dossier Medical', 14, yPos);
        yPos += 10;

        // Dossier Information
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPos, pageWidth - 28, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('Dossier Information', 16, yPos + 5.5);
        yPos += 12;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Type: ${this.dossier.type}`, 16, yPos);
        yPos += 6;
        doc.text(`Notes: ${this.dossier.notes || 'No notes'}`, 16, yPos);
        yPos += 10;

        // Patient Information
        if (this.patient) {
            doc.setFillColor(240, 240, 240);
            doc.rect(14, yPos, pageWidth - 28, 8, 'F');
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text('Patient Information', 16, yPos + 5.5);
            yPos += 12;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`Name: ${this.patient.nom} ${this.patient.prenom}`, 16, yPos);
            yPos += 6;
            doc.text(`CIN: ${this.patient.cin}`, 16, yPos);
            yPos += 6;
            doc.text(`Phone: ${this.patient.telephone || 'N/A'}`, 16, yPos);
            yPos += 10;
        }

        // Documents Table
        if (this.dossier.documents && this.dossier.documents.length > 0) {
            autoTable(doc, {
                startY: yPos,
                head: [['Name', 'Type', 'Upload Date', 'Access Confirmed']],
                body: this.dossier.documents.map(doc => [
                    doc.nom,
                    doc.type,
                    new Date(doc.dateUpload).toLocaleDateString('fr-FR'),
                    doc.accesConfirmePatient ? 'Yes' : 'No'
                ]),
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Predictive Analyses Table
        if (this.dossier.analyses && this.dossier.analyses.length > 0) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            autoTable(doc, {
                startY: yPos,
                head: [['Analysis Type', 'Result']],
                body: this.dossier.analyses.map(analyse => [
                    analyse.type,
                    analyse.resultat
                ]),
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Prescriptions Table
        if (this.dossier.ordonnances && this.dossier.ordonnances.length > 0) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            autoTable(doc, {
                startY: yPos,
                head: [['Date Prescription', 'Medicaments']],
                body: this.dossier.ordonnances.map(ord => [
                    new Date(ord.datePrescription).toLocaleDateString('fr-FR'),
                    ord.medicaments
                ]),
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Exam Results Table
        if (this.dossier.resultatsExamens && this.dossier.resultatsExamens.length > 0) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            autoTable(doc, {
                startY: yPos,
                head: [['Type Examen', 'Date Examen', 'Result']],
                body: this.dossier.resultatsExamens.map(exam => [
                    exam.typeExamen,
                    new Date(exam.dateExamen).toLocaleDateString('fr-FR'),
                    exam.resultat
                ]),
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                theme: 'striped',
                margin: { left: 14, right: 14 }
            });
        }

        // Footer on all pages
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            doc.text('MedLoop - Confidential Medical Record', pageWidth / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
        }

        // Save PDF
        const patientName = this.patient ? `${this.patient.nom}_${this.patient.prenom}` : 'Unknown';
        doc.save(`Dossier_${patientName}_${new Date().getTime()}.pdf`);
    }
}
