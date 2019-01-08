import { Injectable } from '@angular/core';
import {formatDate, DatePipe} from '@angular/common';

//import {formatDate, DatePipe, registerLocaleData} from '@angular/common';
// lo pones en el module
//import localeES from '@angular/common/locales/es';

import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import {Region} from './region';
// throwError convertir error en observable
import {of, Observable,throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2';

import {Router} from '@angular/router';

@Injectable()
export class ClienteService {
  private urlEndPoint: string= 'http://localhost:8080/api/clientes';

  private httpHeaders= new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http:HttpClient,
              private router: Router) { }

  getRegiones():Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }

  //getClientes(): Observable<Cliente[]>{
    // convertir el listado de clienes en un observable
    // return of(CLIENTES);

    // una forma
    // return this.http.get<Cliente[]>(this.urlEndPoint);

    // otra forma
    // return this.http.get(this.urlEndPoint).pipe(
    //   map(response => response as Cliente[])
    // );

    // tap no modifica el flujo de dato
    // map si que cambia

    //getCliente con paginator
    getClientes(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response:any) => {
        console.log("ClienteService: tap 1");
        (response.content as Cliente[]).forEach( cliente => {
        console.log(cliente.nombre);
        }
        )
      }),
      map((response:any) => {
           (response.content as Cliente[]).map(cliente => {
             cliente.nombre = cliente.nombre.toUpperCase();

             //let datePipe= new DatePipe('es');
             // cliente.createAt= datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
              //cliente.createAt= datePipe.transform(cliente.createAt,'fullDate');
             // otra forma de dar formato a la fecha
             //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');

             return cliente;
           });
           return response;
      }),
      tap(response => {
          console.log("ClienteService: tap 2");
          (response.content as Cliente[]).forEach( cliente => {
              console.log(cliente.nombre);
          })
        })
      );
  }

  //response es del tipo object tienes que convertirlo en any
  // tambien se podria hacer con observable<any> ythis.http.post<any>
  // en el rest tiene un json con mensaje y cliente
  create(cliente: Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers:this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {

        // error de validar cliente en servidor
        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
      catchError(e => {

        // error de validar cliente en servidor
        if(e.status==400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    // es nativa js no hay que importarla
    let formData= new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });

    return this.http.request(req);
    };

    // sin barra de progreeso
    // subirFoto(archivo: File, id): Observable<Cliente>{
   // es nativa js no hay que importarla
   // let formData= new FormData();
//   formData.append("archivo",archivo);
//   formData.append("id",id);
    // return this.http.post(`${this.urlEndPoint}/upload`,formData).pipe(
    //   map((response:any)=> response.cliente as Cliente),
    //   catchError(e => {
    //     console.error(e.error.mensaje);
    //     swal(e.error.mensaje, e.error.error, 'error');
    //     return throwError(e);
    //   })
    // );
  //}
}
