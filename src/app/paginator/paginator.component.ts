//input para inyectar de padre al hijo
import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit {
  @Input() paginador: any;
  paginas: number[];
  constructor() { }

  ngOnInit() {
    // fill(0) rellena el array con 0
    // _valor porque no se utiliza quita el warning
    // indice +1 para empezar por 1
    this.paginas= new Array(this.paginador.totalPages).fill(0).map((_valor,indice)=> indice+1);
  }

}
