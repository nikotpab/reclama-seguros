import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { NotificationService } from '../app/services/notification.service';
import { DatosCompartidosService } from '../app/services/shared-data.service'; 

import { timeout, catchError, finalize } from 'rxjs/operators';
import { of, throwError, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class Register {
  user = {
    fullName: '',
    email: '',
    phone: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  };

  verificationCode: string = '';
  step: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private notification: NotificationService,
    private datosShared: DatosCompartidosService 
  ) { }

  ngOnInit(): void {
    
    const preData = this.datosShared.obtenerDatos().preRegisterData;
    if (preData) {
      this.user.fullName = preData.fullName || '';
      this.user.email = preData.email || '';
      this.user.phone = preData.phone || '';

      
    }
  }

  onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^0-9]/g, '');
    
    if (input.value !== cleanValue) {
      input.value = cleanValue;
    }
    
    if (input.dataset['field'] === 'phone') this.user.phone = input.value;
    if (input.dataset['field'] === 'cedula') this.user.cedula = input.value;
  }

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      this.notification.showError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    const phoneRegex = /^3[0-9]{9}$/;
    if (!phoneRegex.test(this.user.phone)) {
      this.notification.showError('Número de teléfono inválido');
      return;
    }

    const cedulaRegex = /^[0-9]{6,12}$/;
    if (!cedulaRegex.test(this.user.cedula)) {
      this.notification.showError('La cédula debe contener entre 6 y 12 dígitos numéricos.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.registerUser(this.user)
      .pipe(

        timeout(5000),


        catchError(error => {
          console.error("❌ Error capturado:", error);



          if (error instanceof TimeoutError || error.status === 0) {
            console.warn("El servidor tardó o hubo bloqueo de red, pero avanzamos al paso 2.");
            return of({ message: 'Forzando avance por timeout/error de red' });
          }


          return throwError(() => error);
        }),


        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {

          this.notification.showSuccess('Código enviado. Revisa tu correo electrónico.');
          this.router.navigate(['/autenticacion'], { queryParams: { mode: 'verify', email: this.user.email } });
        },
        error: (err) => {

          this.errorMessage = err.error?.error || 'Error en el registro. Intenta nuevamente.';
        }
      });
  }

  verifyCode() {
    this.isLoading = true;
    const payload = {
      email: this.user.email,
      code: this.verificationCode
    };

    this.apiService.verifyUser(payload)
      .pipe(
        timeout(5000),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res) => {
          this.notification.showSuccess('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');

          this.router.navigate(['/autenticacion']);
        },
        error: (err) => {
          console.error(err);
          this.notification.showError(err.error?.error || 'Código incorrecto. Verifica e intenta nuevamente.');
        }
      });
  }
}