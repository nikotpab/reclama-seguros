import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatosCompartidosService } from '../app/services/shared-data.service';

@Component({
  selector: 'app-consulta-seguros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class ConsultaSegurosComponent {
  consultaForm: FormGroup;
  enviado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datosService: DatosCompartidosService
  ) {
    this.consultaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('3[0-9]{9}')]]
    });
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.consultaForm.valid) {

      this.datosService.guardarDatos(this.consultaForm.value);
      this.router.navigate(['asistente']);
    }
  }

  get f() { return this.consultaForm.controls; }
}