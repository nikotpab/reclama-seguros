import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class PanelUsuarioComponent implements OnInit {


  consultas = signal<any[]>([]);
  loading = signal<boolean>(true);

  private api = inject(ApiService);
  private datos = inject(DatosCompartidosService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const userData = this.datos.obtenerDatos();

    if (!userData.userId) {
      this.router.navigate(['/autenticacion']);
      return;
    }



    this.api.getConsultationsByUser(userData.userId).subscribe({
      next: (data) => {

        this.consultas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.datos.limpiarDatos();
    this.router.navigate(['/autenticacion']);
  }

  verDetalle(consulta: any): void {
    this.datos.guardarDatos({ consultationId: consulta.id });

    switch (consulta.status) {
      case 'IN_PROGRESS':
      case 'PAID':
        this.router.navigate(['/solicitudes']);
        break;
      case 'NOT_FOUND':
        this.router.navigate(['/resultado'], { queryParams: { estado: 'NOT_FOUND' } });
        break;
      case 'FOUND':
        this.router.navigate(['/resultado'], { queryParams: { estado: 'FOUND' } });
        break;
      case 'CLAIM_STARTED':
        this.router.navigate(['/seguimiento']);
        break;
      case 'LIQUIDATION_READY':
        this.router.navigate(['/liquidacion', consulta.id]);
        break;
      default:
        this.router.navigate(['/solicitudes']);
    }
  }
}