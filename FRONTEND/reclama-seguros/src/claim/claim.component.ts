import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguimiento-reclamo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class SeguimientoReclamoComponent {
  private router = inject(Router);

  steps = [
    { label: 'Documentos recibidos', status: 'completed' },
    { label: 'Contrato firmado', status: 'completed' },
    { label: 'Radicación en aseguradora', status: 'pending' },
    { label: 'Respuesta de aseguradora', status: 'pending' },
    { label: 'Pago y liquidación', status: 'pending' }
  ];

  volverPanel(): void {
    this.router.navigate(['/panel-usuario']);
  }
}