import { Routes } from '@angular/router';
import { WizardComponent } from '../wizard/wizard.component'
import { ConsultaSegurosComponent } from '../landing_page/home.component'
import { Register } from '../register/register.component'
import { Authorization } from '../auth_consultation/auth.component';
import { Payment } from '../payment/payment.component';
import { Request } from '../request/request.component';
import { HomeComponent } from '../home_page/home.component';
import { AuthComponent } from '../login_register/login-register.component';
import { ContratoMandatoComponent } from '../agreement/agreement.component';
import { SeguimientoReclamoComponent } from '../claim/claim.component';
import { LiquidationComponent } from '../liquidation/liquidation.component';
import { UploadDocumentsComponent } from '../document/upload-documents.component';
import { PanelUsuarioComponent } from '../user/user.component'
import { AdminDashboardComponent } from '../admin/admin.component'
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { WizardComponentRegistered } from '../wizard_registered/wizard-registered.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'consulta', component: ConsultaSegurosComponent },
    { path: 'asistente', component: WizardComponent },
    { path: 'registro', component: Register },
    { path: 'autorizar', component: Authorization },
    { path: 'pago', component: Payment },
    { path: 'solicitudes', component: Request },
    { path: 'inicio', component: HomeComponent },
    { path: 'autenticacion', component: AuthComponent },
    { path: 'contrato', component: ContratoMandatoComponent },
    { path: 'seguimiento', component: SeguimientoReclamoComponent },
    { path: 'liquidacion/:id', component: LiquidationComponent, canActivate: [authGuard] },
    { path: 'carga-documentos', component: UploadDocumentsComponent, canActivate: [authGuard] },
    { path: 'panel-usuario', component: PanelUsuarioComponent, canActivate: [authGuard] },
    { path: 'administrador', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'tipo-solicitud', component: WizardComponentRegistered, canActivate: [authGuard] },
    { path: '**', redirectTo: 'inicio' }
];
