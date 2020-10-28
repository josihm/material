import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../servicios/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  roles: string[]=[];
  errorMsg = '';

  constructor(private tokenServicio: TokenService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.tokenServicio.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenServicio.getAuthorities();
    }else{
      this.router.navigate(['login']);
    }
  }

}
