import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import {ClienteService} from './cliente.service';
import {ModalService} from './detalle/modal.service';
import swal from 'sweetalert2';
import {tap} from 'rxjs/operators';

// coger el :page de la uri
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
              private modalService: ModalService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    // subscribe para comprobar si el parametro cambia
    this.activatedRoute.paramMap.subscribe( params => {
      //+ para convertir el string a number
     let page: number= +params.get('page');
     // no existe page
     if(!page){
       page = 0;
     }
     this.clienteService.getClientes(page).pipe(
       tap(response => {
       console.log("ClienteService: tap 3");
       (response.content as Cliente[]).forEach( cliente => {
         console.log(cliente.nombre);
        });
       })
    ).subscribe(response=>{
      this.clientes = response.content as Cliente[];
      this.paginador = response;
    })
  });

      this.modalService.notificarUpload.subscribe(cliente=>{
        this.clientes= this.clientes.map(clienteOriginal=>{
          if(cliente.id== clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      })
  }

  delete(cliente: Cliente): void{
    swal({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente );
              swal(
                'Cliente Eliminado',
                `Cliente ${cliente.nombre} eliminado con exito.`,
                'success'
              )
            }
          )}
      })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado= cliente;
    this.modalService.abrirModal();
  }

}
