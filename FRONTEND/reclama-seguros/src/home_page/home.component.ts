import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private datosShared = inject(DatosCompartidosService);

  captureForm: FormGroup;

  constructor() {
    this.captureForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^3[0-9]{9}$/)]]
    });
  }

  iniciarConsulta(): void {
    if (this.captureForm.valid) {
      // Guardar datos en el servicio compartido para usarlos en el registro
      this.datosShared.guardarDatos({
        preRegisterData: this.captureForm.value
      });
      // Ir al wizard
      this.router.navigate(['/asistente']);
    } else {
      this.captureForm.markAllAsTouched();
    }
  }

  onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^0-9]/g, '');
    if (input.value !== cleanValue) {
      input.value = cleanValue;
      input.dispatchEvent(new Event('input'));
    }
  }

  irALogin(): void {
    this.router.navigate(['/autenticacion'], { queryParams: { mode: 'login' } });
  }

  irARegistro(): void {
    this.router.navigate(['/autenticacion'], { queryParams: { mode: 'register' } });
  }
}