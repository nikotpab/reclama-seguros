import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DatosCompartidosService } from '../services/shared-data.service';

export const authGuard = () => {
  const router = inject(Router);
  const datosService = inject(DatosCompartidosService);
  const platformId = inject(PLATFORM_ID);

  
  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  
  const user = datosService.obtenerDatos();

  if (user && user.userId) {
    return true;
  } else {
    router.navigate(['/autenticacion']);
    return false;
  }
};