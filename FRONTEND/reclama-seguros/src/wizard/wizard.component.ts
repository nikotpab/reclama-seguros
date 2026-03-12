import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent {
  stepForm: FormGroup;
  tipoConsulta: string = '';
  enviado: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.stepForm = this.fb.group({
      nombreFallecido: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      fechaFallecimiento: [''],
      parentesco: ['']
    });
  }

  seleccionarTipo(tipo: string) {
    this.tipoConsulta = tipo;

    const fields = ['nombreFallecido', 'tipoDocumento', 'numeroDocumento', 'fechaFallecimiento', 'parentesco'];

    if (tipo === 'fallecido') {
      fields.forEach(field => {
        this.stepForm.get(field)?.setValidators(Validators.required);
        this.stepForm.get(field)?.updateValueAndValidity();
      });
    } else {
      fields.forEach(field => {
        this.stepForm.get(field)?.clearValidators();
        this.stepForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  onSubmit() {
    this.enviado = true;
    if (this.tipoConsulta && this.stepForm.valid) {

      this.router.navigate(['registro']);
    }
  }

  get f() { return this.stepForm.controls; }
}