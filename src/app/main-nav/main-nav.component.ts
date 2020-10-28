import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Departamento } from '../Modelos/departamento.class';
import { TokenService } from 'src/app/servicios/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  title = 'material';
  deptoSesion: Departamento = new Departamento();
  isLogged = false;
  isLogin = false;
  roles: string[];
  authority: string;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private tokenServicio: TokenService) {}

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
  
  sst(){
    //this.router.navigate(['sst']);
    this.router.navigate(['solicitudesst']);
  }

  ssc(){
    this.router.navigate(['solicitudessc']);
  }
}
