import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

//Servicios
import { AuthService } from 'src/app/servicios/auth.service';
import { DepartamentoID, DepartamentoService } from 'src/app/servicios/departamento.service';
import { TokenService } from 'src/app/servicios/token.service';

import { Encriptar } from 'src/app/servicios/encriptar';
import { DepartamentoI } from 'src/app/Modelos/departamento.interface';
import { Departamento } from 'src/app/Modelos/departamento.class';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { database } from 'firebase';
import { Token } from 'src/app/Modelos/token';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  token: Token;

  private unSubscribe$ = new Subject<void>();

  isLogged = false;
  isLoginFail = false;
  roles: string[];
  errorMensage = '';

  deptoAny: Observable<DepartamentoI>;
  depto: DepartamentoI[];
  deptoClass: Departamento = new Departamento();
  deptoSel: Departamento = new Departamento();
  //deptoId: DepartamentoID;

  correosind: string;
  psw: string;
  pswEncriptado: string;
  pswDesencriptado: string;

  /*loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });*/

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              //private fb: FormBuilder,
              //private ngZone: NgZone,
              private deptoServicio: DepartamentoService,
              private authServicio: AuthService,
              private tokenServicio: TokenService) { }

  ngOnInit(): void {
    if (this.tokenServicio.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenServicio.getAuthorities();
      window.location.replace("home");
    }
  }

  createUser() {
    /*this.afAuth.auth.createUserWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
       this.router.navigate(['/todos']);
     }).catch(response => {
       this.errorMessage = response.message;
     });*/
  }
  
  signIn(correo:string,psw:string) { 
    /*this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(() => {
       this.router.navigate(['/todos']);
     }).catch(response => {
       this.errorMessage = response.message;
     });*/
     console.log(this.authServicio.getLogin(correo));
  }

  login(){
    console.log("email: ", this.correosind);
    console.log("password", this.psw);
    //this.depto = this.authServicio.signIn(this.correosind, this.psw);
    //console.log("Departamento->", this.depto);
    /*.subscribe(data =>{
      this.depto=data;
    });*/
  }

  search(correo: string, psw: string){
    try{
      this.authServicio.col$(
        'departamentos',
        ref => ref.where('correosind','==',correo)
                  //.where('psw','==','U2FsdGVkX1+KpPNuOB/az/TAAGdaREh9+QuzFWGE30M=')
      ).pipe(takeUntil(this.unSubscribe$))
      .subscribe(response => { console.log('RESPONSE', response);
                                this.deptoClass = response;
                                this.authServicio.deptoSelected = response;
                                this.deptoAny = response;
                                this.depto = this.deptoClass[0];
                                this.deptoSel = this.deptoClass[0];
                                if (this.deptoSel!=null){
                                  this.pswDesencriptado = this.verificarPassword(this.deptoClass[0].psw);
                                  console.log("CONSOLA",this.deptoClass[0]);
                                  console.log("DEPTO: ", this.depto);
                                  console.log("CORREO: ", this.deptoSel.correosind);
                                  //console.log("DESENCRIPTADO: ", this.pswDesencriptado);
                                  if (this.pswDesencriptado == psw) {
                                    console.log("PASSWORDS IGUALES");
                                    this.deptoSel.psw = "";
                                    let deptoSesion = JSON.stringify(this.deptoSel);
                                    localStorage.setItem("deptoSesion", deptoSesion);
                                    this.tokenServicio.setToken(this.deptoSel.id.toString());
                                    this.tokenServicio.setUserName(this.deptoSel.correosind.toString());
                                    this.tokenServicio.setAuthorities([this.deptoSel.departamento.toString()]);
                                    //console.log(window.sessionStorage.getItem(this.tokenServicio.getToken()));
                                    console.log(localStorage.getItem("deptoSesion"));
                                    this.isLogged=true;
                                  }else{
                                    alert("Verifique su contraseña");
                                    this.psw='';
                                    console.log("PASSWORDS DIFERENTES");
                                  }
                                }else{
                                  (err: any)=>{
                                    this.isLogged = false;
                                    this.isLoginFail = true;
                                    this.errorMensage = "Usuario y contraseña incorrectas";
                                  }
                                  //Programar para que mande mensaje
                                  console.log("No existe el correo");
                                  alert("Correo y contraseña incorrectas");
                                  this.limpiarFormulario();
                                  this.ngOnInit();
                                }
                                
                                
                                
                                
                              }
      );
    }catch(error){
      //console.log(error);
      console.log("correo y/o contraseña incorrectos");
    }
    console.log("-------------------------------------------------");
    
  }

  onIsError(){
      
  }

  
  verificarPassword(psw: string):string{
    return Encriptar.desencriptar(psw);
  }

  limpiarFormulario(){
    this.correosind = '';
    this.psw = '';
  }

  redirecciona(){
    this.router.navigate[("home")];
  }
}
