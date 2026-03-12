import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-paso-cuatro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class Payment {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private datosService = inject(DatosCompartidosService);
  private notification = inject(NotificationService);

  selectedMethod: string = 'credit-card';
  isProcessing: boolean = false;

  selectMethod(method: string): void {
    this.selectedMethod = method;
  }

  processPayment(): void {
    this.isProcessing = true;

    const datos = this.datosService.obtenerDatos();
    const consultationId = datos.consultationId;

    if (!consultationId) {
      this.notification.showError('No se encontró información del trámite. Por favor inicia nuevamente.');
      this.isProcessing = false;
      return;
    }

    this.apiService.processPayment(consultationId).subscribe({
      next: (res) => {

        setTimeout(() => {
          this.isProcessing = false;
          this.router.navigate(['solicitudes']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error en pago:', err);
        this.notification.showError('Hubo un problema al procesar el pago. Intenta más tarde.');
        this.isProcessing = false;
      }
    });
  }
}