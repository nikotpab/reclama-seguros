import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultado-consulta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-consultation.component.html',
  styleUrls: ['./result-consultation.component.css']
})
export class ResultadoConsultaComponent implements OnInit {
  private router = inject(Router);
  
  // Simulamos el estado. En producción esto vendría del Backend/Service
  estado: 'FOUND' | 'NOT_FOUND' = 'FOUND'; 
  nombreConsultado: string = 'Álvaro Pérez Rojas';

  ngOnInit(): void {}

  nuevaConsulta(): void {
    this.router.navigate(['/asistente']);
  }

  iniciarReclamacion(): void {
    this.router.navigate(['/documentos']);
  }

  decidirDespues(): void {
    this.router.navigate(['/panel-usuario']);
  }
}