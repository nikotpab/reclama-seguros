import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../app/services/api.service';
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { NotificationService } from '../app/services/notification.service';
import { finalize } from 'rxjs/operators';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: boolean = true;
  isSubmitting: boolean = false;
  showVerification: boolean = false;
  private zone = inject(NgZone);


  loginForm: FormGroup;
  registerForm: FormGroup;
  verificationControl: FormControl;

  passwordVisible: boolean = false;


  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datosService = inject(DatosCompartidosService);
  private cd = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]{6,12}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^3[0-9]{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.verificationControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'verify' && params['email']) {
        this.showVerification = true;
        this.registerForm.patchValue({ email: params['email'] });
      } else if (params['mode'] === 'register') {
        this.isLoginMode = false;
        this.showVerification = false;
      } else {
        this.isLoginMode = true;
        this.showVerification = false;
      }
    });

    // Check query params to auto-switch to register if coming from wizard (indirectly)
    // or if we have pre-filled data
    const preData = this.datosService.obtenerDatos().preRegisterData;
    if (preData && !this.showVerification) {
      this.registerForm.patchValue({
        fullName: preData.fullName,
        email: preData.email,
        phone: preData.phone
      });
      // You might want to switch to register mode implicitly if data is present
      // But let's respect the 'mode' param primarily. If user clicks "Register" in Wizard, they go to /registro (old) or /autenticacion?mode=register
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.showVerification = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.verificationControl.reset();
  }

  onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/[^0-9]/g, '');
    if (input.value !== cleanValue) {
      input.value = cleanValue;
      // Trigger input event for reactive forms
      input.dispatchEvent(new Event('input'));
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }


  private handleLogin(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const credentials = this.loginForm.value;

    this.apiService.login(credentials)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          this.datosService.guardarDatos({ userId: res.id, email: res.email });

          if (credentials.email === 'admin@gmail.com' && credentials.password === '123456') {
            this.router.navigate(['/administrador']);
          } else {
            this.router.navigate(['/panel-usuario']);
          }
        },
        error: (err) => {
          this.notification.showError(err.error?.error || 'Credenciales incorrectas o cuenta no verificada. Intenta nuevamente.');
          this.isSubmitting = false;
        }
      });
  }


  private handleRegister(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const userData = this.registerForm.value;



    this.apiService.registerUser(userData)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.zone.run(() => {
            this.showVerification = true;
          });
        },
        error: (err) => {
          this.notification.showError(err.error?.error || 'Error en el registro. Verifique que los datos sean correctos.');
          this.isSubmitting = false;
        }
      });
  }


  verifyCode(): void {
    if (this.verificationControl.invalid) return;

    this.isSubmitting = true;
    const payload = {
      email: this.registerForm.get('email')?.value,
      code: this.verificationControl.value
    };

    this.apiService.verifyUser(payload)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.notification.showSuccess('¡Cuenta verificada! Ahora inicia sesión para continuar.');

          this.showVerification = false;
          this.isLoginMode = true;
          this.cd.detectChanges();
        },
        error: (err) => {
          this.notification.showError(err.error?.error || 'Código incorrecto. Verifica el código enviado a tu correo.');
          this.isSubmitting = false;
        }
      });
  }

  get l() { return this.loginForm.controls; }
  get r() { return this.registerForm.controls; }
}