import * as CryptoJS from 'crypto-js';
export class Encriptar{
    private static key: string = "♪☼§ihm";
    private static txtcryp: string;
    private static txtdecryp: string;

    construtor(){}

    static encrypt(psw: string):string{
        return this.txtcryp = CryptoJS.AES.encrypt(psw.trim(),this.key.trim()).toString();
        //return this.txtcryp = CryptoJS.AES.encrypt(psw,this.key.toString());
    }
    
    static desencriptar(psw:string){
        return this.txtdecryp = CryptoJS.AES.decrypt(psw.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
    }
}