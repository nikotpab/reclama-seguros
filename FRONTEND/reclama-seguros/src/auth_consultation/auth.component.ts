import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class Authorization implements AfterViewInit {
  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  signatureForm: FormGroup;
  private cx!: CanvasRenderingContext2D | null;
  private http = inject(HttpClient);
  private datosService = inject(DatosCompartidosService);

  isDrawing = false;
  hasSigned = false;
  mostrarModal = false;
  enviado = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private notification: NotificationService) {
    this.signatureForm = this.fb.group({
      authorization: [false, Validators.requiredTrue]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvasEl: HTMLCanvasElement = this.canvasRef.nativeElement;
      this.cx = canvasEl.getContext('2d');

      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;

      if (this.cx) {
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
      }
    }, 100);

    window.addEventListener('resize', () => {
      const canvasEl = this.canvasRef.nativeElement;
      const oldImage = canvasEl.toDataURL();
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;

      if (this.cx) {
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';

        const img = new Image();
        img.src = oldImage;
        img.onload = () => this.cx?.drawImage(img, 0, 0);
      }
    });
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    const { x, y } = this.getPosition(event);
    this.cx?.beginPath();
    this.cx?.moveTo(x, y);
    event.preventDefault();
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing) return;
    const { x, y } = this.getPosition(event);
    this.cx?.lineTo(x, y);
    this.cx?.stroke();
    this.hasSigned = true;
    event.preventDefault();
  }

  stopDrawing(): void {
    this.isDrawing = false;
    this.cx?.closePath();
  }

  getPosition(event: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  clearSignature(): void {
    const canvas = this.canvasRef.nativeElement;
    this.cx?.clearRect(0, 0, canvas.width, canvas.height);
    this.hasSigned = false;
  }

  abrirDocumento(e: Event): void {
    e.preventDefault();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.signatureForm.valid && this.hasSigned) {
      this.isSubmitting = true;

      const canvasEl = this.canvasRef.nativeElement;
      const signatureBase64 = canvasEl.toDataURL('image/webp', 0.5);

      const datosUsuario = this.datosService.obtenerDatos();
      const consultationId = datosUsuario.consultationId;

      if (!consultationId) {
        this.notification.showError('No se encontró el ID de la consulta. Por favor intenta volver a empezar el proceso.');
        this.isSubmitting = false;
        return;
      }

      const payload = {
        base64Signature: signatureBase64
      };

      this.http.post(`/api/consultations/${consultationId}/sign`, payload)
        .subscribe({
          next: (res) => {

            this.router.navigate(['pago']);
          },
          error: (err) => {
            console.error('Error al guardar firma:', err);
            this.notification.showError('Ocurrió un error al guardar tu firma. Por favor intenta nuevamente.');
            this.isSubmitting = false;
          }
        });
    }
  }

  get f() { return this.signatureForm.controls; }
}