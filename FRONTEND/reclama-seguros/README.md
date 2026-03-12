# Reclama Seguros - Plataforma de Gestión de Seguros de Vida

## Descripción General
Reclama Seguros es una solución digital diseñada para automatizar la identificación y cobro de seguros de vida no reclamados. La plataforma centraliza el proceso de consulta ante las aseguradoras, permitiendo a los usuarios verificar la existencia de pólizas a título personal o de familiares fallecidos mediante un flujo seguro y legal.



El sistema gestiona el ciclo completo del servicio, desde la captación del usuario y la autorización legal, hasta la radicación de reclamaciones y el seguimiento de indemnizaciones .

## Módulos Funcionales
La arquitectura de la aplicación se divide en cuatro componentes estratégicos que garantizan la integridad del proceso:

1. Captación y Registro de Usuarios

Este módulo gestiona el ingreso de datos y la creación de perfiles seguros.

Interfaz de Entrada: Página principal optimizada para la conversión, enfocada en informar al usuario sobre la búsqueda de seguros sin cobrar.


Asistente de Consulta (Wizard): Un sistema guiado paso a paso que permite al usuario seleccionar el tipo de consulta (propia o de un tercero) y registrar la información vital del asegurado, como documentos de identidad y fechas de fallecimiento .


Persistencia de Datos: Generación automática de cuentas de usuario y credenciales para asegurar el acceso recurrente al estado del trámite.


2. Legalización y Procesamiento

Este componente asegura la validez jurídica de la solicitud y la gestión comercial.

Firma Electrónica: Integración de herramientas de firma digital para formalizar la autorización de consulta ante las entidades aseguradoras.


Pasarela de Pagos: Sistema de cobro integrado para gestionar la tarifa de la consulta (USD $10), condicionando la activación de la búsqueda a la confirmación del pago.


Notificación Masiva: Automatización del envío de solicitudes a las áreas de indemnización de las aseguradoras registradas.


3. Panel de Control y Seguimiento

Un entorno privado donde el cliente visualiza el avance de su solicitud en tiempo real.

Estados de Consulta: Clasificación automática de los trámites en tres estados: "En curso", "Sin pólizas encontradas" o "Pólizas encontradas" .

Gestión de Resultados Negativos: Flujo de cierre informativo en caso de que las aseguradoras no reporten coincidencias.


Gestión de Resultados Positivos: Notificación proactiva al usuario cuando se detectan pólizas vigentes, habilitando el módulo de reclamación.


4. Gestión de Reclamaciones

Módulo exclusivo que se activa tras el hallazgo de una póliza, diseñado para la recuperación de capital.

Repositorio Documental: Interfaz para la carga segura de documentos probatorios (cédulas, registros civiles de defunción, soportes de parentesco) .


Contrato de Mandato: Flujo de firma electrónica secundaria para autorizar la representación legal y acordar los honorarios por éxito sobre la indemnización recuperada.


Línea de Tiempo: Visualización del progreso de la reclamación, abarcando desde la radicación de documentos hasta la aprobación del pago por parte de la aseguradora .

## Flujo de Navegación
La experiencia de usuario está diseñada de manera lineal y progresiva:

Consulta: Ingreso de datos y pago del servicio de búsqueda.


Espera Activa: Monitoreo del panel de control mientras las aseguradoras procesan la solicitud.


Acción: En caso de éxito, el usuario autoriza la gestión de cobro y aporta la documentación requerida.


Resolución: Visualización de la liquidación y aprobación final de la indemnización.


## Privacidad y Seguridad
El sistema contempla la protección de datos sensibles mediante la aceptación explícita de términos y condiciones antes de iniciar cualquier trámite. Asimismo, todas las interacciones con terceros (aseguradoras) están respaldadas por documentos de autorización firmados digitalmente por el titular o beneficiario legítimo
