import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estado-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class Request {
  private router = inject(Router);
  fechaInicio: Date = new Date();

  irAlPanel(): void {
    this.router.navigate(['panel-usuario']);
  }
}