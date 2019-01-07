import { Component, OnInit, Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import {ModalService} from './modal.service';
// import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";

  private fotoSeleccionada: File;
  progreso:number =0;

  // private activatedRoute: ActivatedRoute
  constructor(private ClienteService: ClienteService,
              private modalService: ModalService
              ) { }

  ngOnInit() {
    // pasarlo por parametro en la uri
    // this.activatedRoute.paramMap.subscribe(params=>{
    //   let id: number= +params.get('id');
    //   if(id){
    //     this.ClienteService.getCliente(id).subscribe(cliente=>{
    //       this.cliente= cliente;
    //     });
    //   }
    // });
  }
    seleccionarFoto(event){
      this.fotoSeleccionada= event.target.files[0];
      // inicializar cada vez que sube una nueva imagen
      this.progreso=0;
      console.log(this.fotoSeleccionada);
      // no es tipo imagen
      if(this.fotoSeleccionada.type.indexOf('image')<0){
          swal('Error seleccionar imagen:','El archivo debe  ser del tipo imagen', 'error');
          this.fotoSeleccionada=null;
      }
    }


    // uploadprogress mientras se carga
    // response cuando ha finalizado
    subirFoto(){
      if(!this.fotoSeleccionada){
          swal('Error Upload:','Debe seleccionar una foto', 'error');
      }else{
        this.ClienteService.subirFoto(this.fotoSeleccionada,this.cliente.id)
        .subscribe(event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          } else if(event.type === HttpEventType.Response){
            let response: any= event.body;
            this.cliente= response.cliente as Cliente;

            // en el private el get no se pone los ()
            this.modalService.notificarUpload.emit(this.cliente);
            swal('La foto se ha subido completamente',response.mensaje,'success');
          }
        });
      }
    }
    // sin barra de progreso
    // subirFoto(){
    //   if(!this.fotoSeleccionada){
    //       swal('Error Upload:','Debe seleccionar una foto', 'error');
    //   }else{
    //     this.ClienteService.subirFoto(this.fotoSeleccionada,this.cliente.id)
    //     .subscribe(cliente => {
    //       this.cliente=cliente;
    //       swal('La foto se ha subido completamente',`La foto se ha subido con éxito: ${this.cliente.foto}`,'success');
    //     });
    //   }

    cerrarModal(){
      this.modalService.cerrarModal();
      this.fotoSeleccionada=null;
      this.progreso= 0;
    }
}
