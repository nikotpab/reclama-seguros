import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})
export class UploadDocumentsComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private datosService = inject(DatosCompartidosService);
  private notification = inject(NotificationService);


  docs = [
    { id: 1, type: 'cedula', label: 'Cédula del consultante', uploaded: false },
    { id: 2, type: 'defuncion', label: 'Registro civil de defunción', uploaded: false },
    { id: 3, type: 'parentesco', label: 'Documento que acredite parentesco', uploaded: false }
  ];

  onFileSelected(event: any, docType: string): void {
    const file = event.target.files[0];
    if (!file) return;

    const datos = this.datosService.obtenerDatos();


    if (!datos.consultationId) {
      this.notification.showError('No hay un trámite seleccionado para subir documentos.');
      return;
    }

    this.apiService.uploadDocument(datos.consultationId, docType, file).subscribe({
      next: () => {
        const doc = this.docs.find(d => d.type === docType);
        if (doc) doc.uploaded = true;
      },
      error: (err) => this.notification.showError('Hubo un error al subir el archivo. Intenta nuevamente.')
    });
  }

  get allUploaded(): boolean {
    return this.docs.every(d => d.uploaded);
  }

  continuar(): void {
    if (this.allUploaded) {
      this.router.navigate(['/contrato']);
    }
  }
}