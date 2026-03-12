import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DatosCompartidosService } from '../services/shared-data.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard = () => {
  const router = inject(Router);
  const datosService = inject(DatosCompartidosService);
  const notification = inject(NotificationService);
  const platformId = inject(PLATFORM_ID);


  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const user = datosService.obtenerDatos();
  const admins = ['admin@gmail.com'];

  if (user && user.userId && admins.includes(user.email)) {
    return true;
  } else {
    notification.showError('Acceso denegado. No tienes permisos para acceder a esta sección.');
    router.navigate(['/inicio']);
    return false;
  }
};