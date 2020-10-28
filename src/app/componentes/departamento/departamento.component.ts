import { Component, OnInit, Inject } from '@angular/core';
import { DepartamentoService } from 'src/app/servicios/departamento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoI } from 'src/app/Modelos/departamento.interface';
import { Encriptar } from 'src/app/servicios/encriptar';
import { from } from 'rxjs';
//import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {
  depto: DepartamentoI;

  constructor(public departamentoService: DepartamentoService,
              private dialogRef: MatDialogRef<DepartamentoComponent>,
              @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit(): void {
  }

  actualizar(){
    if (this.departamentoService.selected.id == null
      || this.departamentoService.selected.id == ''){
        //nuevo
        let pswEncriptado = Encriptar.encrypt(this.departamentoService.selected.psw);
        let newDepto = {
          departamento: this.departamentoService.selected.departamento,
          titular: this.departamentoService.selected.titular,
          correosind: this.departamentoService.selected.correosind,
          teldirecto: this.departamentoService.selected.teldirecto,
          ext: this.departamentoService.selected.ext,
          ext2: this.departamentoService.selected.ext2,
          psw: pswEncriptado,
        };
        
        this.departamentoService.addDepartamento(newDepto);
    }else{
      this.departamentoService.selected.psw = Encriptar.encrypt(this.departamentoService.selected.psw);
      this.departamentoService.editDepartamento(this.departamentoService.selected);
    }
    this.close();
  }

  close(): void{
    this.dialogRef.close();
  }

}
