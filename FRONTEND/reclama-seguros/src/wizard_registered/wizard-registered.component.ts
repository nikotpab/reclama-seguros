import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../app/services/api.service'
import { DatosCompartidosService } from '../app/services/shared-data.service';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-wizard-registered',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wizard-registered.component.html',
  styleUrls: ['./wizard-registered.component.css']
})
export class WizardComponentRegistered {
  consultaForm: FormGroup;
  enviado: boolean = false;
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);


  private datosService = inject(DatosCompartidosService);
  private notification = inject(NotificationService);

  constructor() {
    this.consultaForm = this.fb.group({
      tipoConsulta: ['', Validators.required],
      nombreFallecido: ['', Validators.required],
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', Validators.required],
      fechaFallecimiento: ['', Validators.required],
      parentesco: ['', Validators.required]
    });
  }

  get f() {
    return this.consultaForm.controls;
  }

  get tipoConsulta() {
    return this.consultaForm.get('tipoConsulta')?.value;
  }

  seleccionarTipo(tipo: string): void {
    this.consultaForm.patchValue({ tipoConsulta: tipo });


    if (tipo === 'propio') {

    }
  }

  onSubmit(): void {
    this.enviado = true;


    if (this.tipoConsulta === 'fallecido' && this.consultaForm.invalid) {
      return;
    }

    this.isSubmitting = true;


    const datosUsuario = this.datosService.obtenerDatos() as any;

    if (!datosUsuario || !datosUsuario.userId) {
      this.notification.showInfo('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      this.router.navigate(['/auth']);
      return;
    }

    const formValues = this.consultaForm.value;



    let nombreFinal = '';
    let docFinal = '';
    let parentezcoFinal = '';

    if (formValues.tipoConsulta === 'propio') {

      nombreFinal = datosUsuario.fullName ? datosUsuario.fullName + ' (Propio)' : 'Consulta a Título Personal';
      docFinal = 'CC';
      parentezcoFinal = 'YO';
    } else {

      nombreFinal = formValues.nombreFallecido;
      docFinal = formValues.numeroDocumento;
      parentezcoFinal = formValues.parentesco;
    }

    const consultationData = {
      userId: datosUsuario.userId,
      type: formValues.tipoConsulta,
      deceasedName: nombreFinal,
      docType: formValues.tipoDocumento || 'CC',
      docNumber: docFinal,
      deathDate: formValues.fechaFallecimiento,
      kinship: parentezcoFinal
    };

    this.api.createConsultation(consultationData).subscribe({
      next: (res: any) => {

        this.datosService.guardarDatos({
          consultationId: res.id,
          nombreFallecido: nombreFinal
        });

        this.router.navigate(['/autorizar']);
      },
      error: (err: any) => {
        this.notification.showError('No se pudo crear el trámite. Verifique los datos e intente nuevamente.');
        this.isSubmitting = false;
      }
    });
  }
}