import { Injectable } from '@angular/core';

const TOKEN_KEY = 'velero';
const USERNAME_KEY = 'jtsistema';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  //ESTE TOKEN NO SIRVE
  roles: string[]=[];

  constructor() { }
  
  public setToken(token: string):void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token.toString());
  }

  public getToken():string{
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUserName(userName: string): void{
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY,userName.toString());
  }

  public getUserName(): string{
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setAuthorities(authorities:string[]): void{
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[]{
    this.roles=[];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY))
        .forEach(authority => {
          this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }

  public logOut():void{
    localStorage.clear();
    window.sessionStorage.clear();
  } 
}
