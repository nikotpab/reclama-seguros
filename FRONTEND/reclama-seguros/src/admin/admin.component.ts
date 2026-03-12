import { Component, OnInit, inject, signal, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../app/services/api.service';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);

  stats = signal<any>({ totalConsultas: 0, pendientes: 0, encontradas: 0, finalizadas: 0 });
  consultations = signal<any[]>([]);
  isLoading = signal<boolean>(true);


  selectedConsultation: any = null;
  currentPage: number = 0;
  totalPages: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;

  // Liquidation
  showLiquidationCalculator: boolean = false;
  liquidationGross: number = 0;
  liquidationCommission: number = 0;
  liquidationNet: number = 0;

  ngOnInit(): void {
    this.loadStats();
    this.loadConsultations(0);
  }

  loadStats(): void {
    this.api.getAdminStats().subscribe({
      next: (data) => {

        this.ngZone.run(() => {
          this.stats.set(data);
        });
      },
      error: (e) => { }
    });
  }

  loadConsultations(page: number): void {
    this.isLoading.set(true);

    this.api.getAllConsultations(page).subscribe({
      next: (response: any) => {
        this.ngZone.run(() => {
          this.consultations.set(response.content);


          this.currentPage = response.number;
          this.totalPages = response.totalPages;
          this.isFirst = response.first;
          this.isLast = response.last;


          this.isLoading.set(false);
        });
      },
      error: (err) => {
        this.ngZone.run(() => { this.isLoading.set(false); });
      }
    });
  }


  prevPage(): void {
    if (!this.isFirst) this.loadConsultations(this.currentPage - 1);
  }

  nextPage(): void {
    if (!this.isLast) this.loadConsultations(this.currentPage + 1);
  }


  verDetalle(id: number): void {
    this.api.getAdminConsultationDetail(id).subscribe({
      next: (data) => {
        this.ngZone.run(() => { this.selectedConsultation = data; });
      },
      error: (err) => {
        this.notification.showError('No se pudo cargar el detalle del caso. Intenta más tarde.');
        this.ngZone.run(() => { this.isLoading.set(false); });
      }
    });
  }

  cerrarModal(): void {
    this.selectedConsultation = null;
    this.showLiquidationCalculator = false;
  }


  openLiquidation(): void {
    if (!this.selectedConsultation) {
      return;
    }
    this.showLiquidationCalculator = true;
    this.liquidationGross = 0;
    this.calculateLiquidation();
    this.cdr.detectChanges();
  }

  calculateLiquidation(): void {
    const gross = this.liquidationGross || 0;
    this.liquidationCommission = Math.round(gross * 0.10);
    this.liquidationNet = gross - this.liquidationCommission;
  }

  confirmLiquidation(): void {
    if (!this.selectedConsultation) return;
    if (this.liquidationGross <= 0) {
      this.notification.showError('Por favor ingrese un monto válido mayor a 0.');
      return;
    }

    if (confirm(`¿Confirmas aprobar el pago por $${this.liquidationNet}?`)) {
      const payload = {
        status: 'LIQUIDATION_READY',
        grossValue: this.liquidationGross,
        commission: this.liquidationCommission,
        netValue: this.liquidationNet
      };

      this.api.updateConsultationStatus(this.selectedConsultation.id, payload).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.selectedConsultation.status = 'LIQUIDATION_READY';
            this.notification.showSuccess('Liquidación registrada y aprobada exitosamente.');
            this.showLiquidationCalculator = false;
            this.cerrarModal();
            this.loadConsultations(this.currentPage);
          });
        },
        error: () => {
          this.notification.showError('Ocurrió un error al registrar la liquidación.');
          this.ngZone.run(() => { this.isLoading.set(false); });
        }
      });
    }
  }

  cambiarEstado(nuevoEstado: string): void {
    if (nuevoEstado === 'LIQUIDATION_READY') {
      this.openLiquidation();
      return;
    }

    if (!this.selectedConsultation) return;

    if (confirm(`¿Confirmas cambiar el estado a ${nuevoEstado}?`)) {
      this.api.updateConsultationStatus(this.selectedConsultation.id, { status: nuevoEstado }).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.selectedConsultation.status = nuevoEstado;
            this.notification.showSuccess(`El estado se ha actualizado a ${nuevoEstado} correctamente.`);
            this.cerrarModal();
            this.loadConsultations(this.currentPage);
          });
        },
        error: () => {
          this.notification.showError('No se pudo actualizar el estado. Intenta nuevamente.');
          this.ngZone.run(() => { this.isLoading.set(false); });
        }
      });
    }
  }
}