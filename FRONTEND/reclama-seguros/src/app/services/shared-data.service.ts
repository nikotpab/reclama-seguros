import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DatosCompartidosService {
  private isBrowser: boolean;


  private readonly TIEMPO_EXPIRACION = 20 * 60 * 1000;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  guardarDatos(datos: any) {
    if (this.isBrowser) {
      const datosActuales = this.obtenerDatos(false);

      const nuevosDatos = {
        ...datosActuales,
        ...datos,
        timestamp: new Date().getTime()
      };

      localStorage.setItem('datosReclamaSeguro', JSON.stringify(nuevosDatos));
    }
  }


  obtenerDatos(verificarExpiracion: boolean = true) {
    if (this.isBrowser) {
      const datosGuardados = localStorage.getItem('datosReclamaSeguro');

      if (!datosGuardados) return {};

      const datos = JSON.parse(datosGuardados);

      if (verificarExpiracion && datos.timestamp) {
        const ahora = new Date().getTime();
        const diferencia = ahora - datos.timestamp;


        if (diferencia > this.TIEMPO_EXPIRACION) {

          this.limpiarDatos();
          return {};
        } else {


          this.actualizarTimestamp(datos);
        }
      }

      return datos;
    }
    return {};
  }

  limpiarDatos() {
    if (this.isBrowser) {
      localStorage.removeItem('datosReclamaSeguro');
    }
  }


  private actualizarTimestamp(datos: any) {
    if (this.isBrowser) {
      datos.timestamp = new Date().getTime();
      localStorage.setItem('datosReclamaSeguro', JSON.stringify(datos));
    }
  }
}