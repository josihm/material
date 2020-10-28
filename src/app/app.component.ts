import { Component, OnInit } from '@angular/core';
import { Departamento } from './Modelos/departamento.class';
import { TokenService } from 'src/app/servicios/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'material';
  deptoSesion: Departamento = new Departamento();
  isLogged = false;
  isLogin = false;
  roles: string[];
  authority: string;
  
  constructor(private router: Router,
              private tokenServicio: TokenService){}

  ngOnInit(){
    if (this.tokenServicio.getToken()) {
      this.deptoSesion = JSON.parse(localStorage.getItem("deptoSesion"));
      this.title = this.deptoSesion.departamento.toString();
      this.isLogged = true;
      this.isLogin = true;
      this.roles = this.tokenServicio.getAuthorities();
      this.roles.every( 
        rol=>{
          if(rol === 'JARDINERÍA Y TRANSPORTES'){
            this.authority = 'admin';
            this.title += " - "+this.tokenServicio.getAuthorities.toString();
            return false;
          }
          this.authority = 'user';
          this.title += " - "+this.tokenServicio.getAuthorities.toString();
          return true;
        }
      );
    }else{
      this.router.navigate(["login"]);
    }
  }

  logOut():void{
    this.tokenServicio.logOut();
    this.isLogged = false;
    this.authority = '';
    this.title = '';
    localStorage.removeItem("deptoSesion");
    localStorage.setItem("deptoSesion", "");
    location.reload();
    this.router.navigate(['login']);
  }

  logIn():void{
    this.router.navigate(['login']);
  }
}
