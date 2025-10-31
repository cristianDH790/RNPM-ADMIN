
import { Injectable,  EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _notificarEvento = new EventEmitter<any>();

  constructor() { }

  get notificarEvento ():EventEmitter<any>{
    return this._notificarEvento;
  }

}
