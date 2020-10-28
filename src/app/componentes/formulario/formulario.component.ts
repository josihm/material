import { Component, OnInit, Inject } from '@angular/core';
import { CustomerService } from 'src/app/servicios/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
  //customerNuevo: CustomerI;
  constructor(public customerService: CustomerService,
              private dialogRef: MatDialogRef<FormularioComponent>,
              @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit(): void {
  }

  onUpdate(){
    if (this.customerService.selected.id == null
      || this.customerService.selected.id == ''){
        //nuevo
        let newCustomer = {
          name: this.customerService.selected.name,
          city: this.customerService.selected.city,
          order: this.customerService.selected.order,
        }
        
        //this.customerNuevo = newCustomer;
        console.log('Nuevo->', newCustomer);
        this.customerService.addCustomer(newCustomer);
    }else{
      this.customerService.editCustomer(this.customerService.selected);
    }
    this.close();
  }

  close(): void{
    this.dialogRef.close();
  }
}
