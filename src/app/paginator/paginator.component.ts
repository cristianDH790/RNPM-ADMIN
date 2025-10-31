import { Component, OnChanges, input, output } from '@angular/core';
import { Paginator } from '../core/util/paginator';


@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  standalone:true
})
export class PaginatorComponent implements OnChanges {

  public paginator = input.required<Paginator | null>();

  public childEvent = output<number>();

  public paginas!: number[];

  private desde!: number;
  private hasta!: number;
  private medio!: number;
  private paginasVisible: number = 20;

  ngOnChanges() {

    if (this.paginator() != null && this.paginator() != undefined) {

      this.medio = Math.ceil(this.paginasVisible / 2);

      this.hasta = this.paginator()!.totalPages < this.paginasVisible ? this.paginator()!.totalPages : ((this.paginator()!.number <= this.medio) ? this.paginasVisible : (((this.paginasVisible + this.paginator()!.number) - this.medio) > this.paginator()!.totalPages ? this.paginator()!.totalPages : ((this.paginasVisible + this.paginator()!.number) - this.medio)));

      this.desde = this.paginator()!.totalPages < this.paginasVisible ? 1 : (((this.hasta + 1 - this.paginasVisible) == 0) ? 1 : (this.hasta + 1 - this.paginasVisible));

      this.paginas = new Array(this.paginator()!.totalPages < this.paginasVisible ? this.paginator()?.totalPages : this.paginasVisible).fill(0).map((valor, indice) => indice + this.desde);

    }
  }

  cambiarPagina(pagina: number) {
    this.childEvent.emit(pagina);
  }


}
