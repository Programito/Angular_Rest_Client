//input para inyectar de padre al hijo
import { Component, OnInit,Input, OnChanges,SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador: any;
  paginas: number[];

  desde:number;
  hasta:number;

  constructor() { }

  // solo se ejecua una vez en la creacion
  ngOnInit() {
      this.initPaginator();
  }

  // cada vez que cambia los valores
   ngOnChanges(changes: SimpleChanges){
      let paginadorActualizado = changes['paginador'];
      // tiene un estado anterior
      if(paginadorActualizado.previousValue){
        this.initPaginator();
      }
    }

    private initPaginator():void{
        this.desde= Math.min(Math.max(1,this.paginador.number-4),this.paginador.totalPages -5);
        this.hasta= Math.max(Math.min(this.paginador.totalPages,this.paginador.number+4),6);

        if(this.paginador.totalPages>5){
            this.paginas= new Array(this.hasta - this.desde +1).fill(0).map((_valor,indice)=> indice+ this.desde);
        }else{
          // fill(0) rellena el array con 0
          // _valor porque no se utiliza quita el warning
          // indice +1 para empezar por 1
          this.paginas= new Array(this.paginador.totalPages).fill(0).map((_valor,indice)=> indice+1);
      }
  }

}
