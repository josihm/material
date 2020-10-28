import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { LoginComponent } from 'src/app/auth/login/login.component';
import { HomeComponent } from 'src/app/home/home.component';
import { AllsstxidComponent } from './componentes/solicitudes/allsstxid/allsstxid.component';
import { SscComponent } from './componentes/solicitudes/ssc/ssc.component';
import { SstComponent } from './componentes/solicitudes/sst/sst.component';
import { ServiciostComponent } from './componentes/solicitudes/serviciost/serviciost.component';
import { AllsscxidComponent } from './componentes/solicitudes/allsscxid/allsscxid.component';
import { CorreoElectronicoComponent } from './componentes/correo-electronico/correo-electronico.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent },
  { path: 'sst', component: SstComponent },
  { path: 'ssc', component: SscComponent },
  { path: 'serviciost', component: ServiciostComponent },
  { path: 'login', component: LoginComponent },
  { path: 'solicitudesst', component: AllsstxidComponent },
  { path: 'solicitudessc', component: AllsscxidComponent },
  { path: 'correo', component: CorreoElectronicoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
