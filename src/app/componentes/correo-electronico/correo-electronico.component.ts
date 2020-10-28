import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/servicios/servicios.service';
//import * as swal from 'Sweetalert';
//import { swal } from 'sweetalert';

@Component({
  selector: 'app-correo-electronico',
  templateUrl: './correo-electronico.component.html',
  styleUrls: ['./correo-electronico.component.scss']
})
export class CorreoElectronicoComponent implements OnInit {

  constructor(public servicios: ServiciosService) { }

  ngOnInit(): void {
  }

  contactForm(form) {
    console.log("form: ", form);
    this.servicios.mandarCorreo(form).subscribe(() => {
      alert("Formulario de contacto");
    });
  }
}
