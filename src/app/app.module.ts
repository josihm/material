import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './mat/mat.module';
import { ListCustomersComponent } from './componentes/list-customers/list-customers.component';

//Servicios
import { CustomerService } from 'src/app/servicios/customer.service';
import { DepartamentoService } from 'src/app/servicios/departamento.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';
import { ServiciosService } from 'src/app/servicios/servicios.service';

// key de firebase
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { ToolbarComponent } from './componentes/toolbar/toolbar.component';
import { FormularioComponent } from './componentes/formulario/formulario.component';
import { FormsModule } from '@angular/forms';
import { MainNavComponent } from './main-nav/main-nav.component';
import { DepartamentoComponent } from './componentes/departamento/departamento.component';
import { ListaDepartamentosComponent } from './componentes/lista-departamentos/lista-departamentos.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { SstComponent } from './componentes/solicitudes/sst/sst.component';
import { SscComponent } from './componentes/solicitudes/ssc/ssc.component';
import { AllsstxidComponent } from './componentes/solicitudes/allsstxid/allsstxid.component';
import { AllsscxidComponent } from './componentes/solicitudes/allsscxid/allsscxid.component';
import { ServiciostComponent } from './componentes/solicitudes/serviciost/serviciost.component';
import { ServicioscComponent } from './componentes/solicitudes/serviciosc/serviciosc.component';
import { HttpClientModule } from '@angular/common/http';
import { CorreoElectronicoComponent } from './componentes/correo-electronico/correo-electronico.component';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    ListCustomersComponent,
    ToolbarComponent,
    FormularioComponent,
    MainNavComponent,
    DepartamentoComponent,
    ListaDepartamentosComponent,
    LoginComponent,
    HomeComponent,
    SstComponent,
    SscComponent,
    AllsstxidComponent,
    AllsscxidComponent,
    ServiciostComponent,
    ServicioscComponent,
    CorreoElectronicoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatModule,
    AngularFireModule.initializeApp(environment.configFirebase),
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ CustomerService,
              DepartamentoService,
              AuthService,
              AngularFirestore,
              TokenService,
              ServiciosService,
              {
                provide: ErrorStateMatcher, 
                useClass: ShowOnDirtyErrorStateMatcher
              },
  ],
  bootstrap: [ AppComponent ],
  //Controla donde se muestra el componente
  entryComponents: [ FormularioComponent,
                    DepartamentoComponent, 
                    SstComponent ]
})
export class AppModule { }
