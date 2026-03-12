import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-liquidation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.css']
})
export class LiquidationComponent implements OnInit {



  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  datosPago: any = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const state = history.state;

    let consultationId = state?.consultationId;

    if (!consultationId) {
      consultationId = this.route.snapshot.paramMap.get('id');
    }

    if (consultationId) {
      this.loadConsultationData(consultationId);
    } else {
      this.datosPago = {
        valorBruto: 0,
        comision: 0,
        valorNeto: 0,
        fechaTransferencia: new Date(),
        mensaje: "No se encontró información del caso."
      };
    }
  }

  loadConsultationData(id: number): void {
    this.api.getConsultationDetail(id).subscribe({
      next: (data) => {
        this.datosPago = {
          id: data.id,
          valorBruto: data.liquidationGrossValue || 0,
          comision: data.liquidationCommission || 0,
          valorNeto: data.liquidationNetValue || 0,
          fechaTransferencia: data.liquidationDate ? new Date(data.liquidationDate) : new Date(),
          // Extra info
          solicitante: data.user?.name || 'N/A',
          cedulaSolicitante: data.user?.cedula || 'N/A',
          fallecido: data.deceasedName || 'N/A',
          docFallecido: data.docNumber || 'N/A',
          tipo: data.consultationType || 'Consulta General'
        };
        this.cdr.detectChanges();
      },
      error: (e) => { }
    });
  }

  descargarPDF(): void {
    if (!this.datosPago) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    // Header
    doc.setFontSize(22);
    doc.setTextColor(39, 174, 96);
    doc.text('Indemnización Aprobada', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Caso #${this.datosPago.id}`, 105, 30, { align: 'center' });

    // Card Simulation
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, 75, 180, 80, 3, 3, 'FD');

    let y = 45;

    // CASE INFO SECTION
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    // Left Column (Solicitante)
    doc.setFont('helvetica', 'bold');
    doc.text('Solicitante:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(this.datosPago.solicitante, 50, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Cédula:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(this.datosPago.cedulaSolicitante, 50, y);

    // Right Column (Fallecido)
    y -= 6; // Reset Y for right col
    doc.setFont('helvetica', 'bold');
    doc.text('Fallecido:', 110, y);
    doc.setFont('helvetica', 'normal');
    doc.text(this.datosPago.fallecido, 140, y);

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Documento:', 110, y);
    doc.setFont('helvetica', 'normal');
    doc.text(this.datosPago.docFallecido, 140, y);

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Tipo de Trámite:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(this.datosPago.tipo, 50, y);

    // DETAILS SECTION
    y = 95;
    const formatMoney = (val: number) => `$ ${new Intl.NumberFormat('es-CO').format(val)}`;

    // Bruto
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Valor Bruto Aseguradora:', 25, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatMoney(this.datosPago.valorBruto), 185, y, { align: 'right' });

    y += 15;
    // Comision
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(192, 57, 43); // Red
    doc.text('Comisión empresa (10%):', 25, y);
    doc.text(`- ${formatMoney(this.datosPago.comision)}`, 185, y, { align: 'right' });

    y += 10;
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(25, y, 185, y);

    y += 15;
    // Total
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80); // Dark Blue
    doc.setFont('helvetica', 'bold');
    doc.text('Valor Neto a Recibir:', 25, y);
    doc.text(formatMoney(this.datosPago.valorNeto), 185, y, { align: 'right' });

    // Footer
    y += 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(127, 140, 141);
    const fechaStr = this.datosPago.fechaTransferencia instanceof Date ?
      this.datosPago.fechaTransferencia.toLocaleDateString() : this.datosPago.fechaTransferencia;

    doc.text(`Fecha programada de pago: ${fechaStr}`, 105, y, { align: 'center' });

    doc.save(`Resumen_Liquidacion_${this.datosPago.id}.pdf`);
  }
}