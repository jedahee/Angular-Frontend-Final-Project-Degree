import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Court } from '../models/court';
@Injectable({
  providedIn: 'root'
})
export class CourtService {

  public url: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  getCourts() {
    return this.http.get<any>(this.url + 'get-courts');
  }

  getCourt(id: number) {
    return this.http.get<any>(this.url + 'get-court/' + id);
  }

  addCourt(court: Court) {
    let data = {
      id: court.id,
      nombre: court.nombre,
      horaInicio: court.horaInicio,
      horaFinalizacion: court.horaFinalizacion,
      direccion : court.direccion,
      aforo: court.aforo,
      precioPorHora: court.precioPorHora,
      disponible: court.disponible,
      iluminacion: court.iluminacion,
      campoAbierto: court.campoAbierto,
      suelo_id: court.suelo_id,
      deporte_id: court.deporte_id
    }
    return this.http.post<any>(this.url + 'add-court', data);
    
  }

  updateCourt(court: Court, id: number) {
    let data = {
      id: court.id,
      nombre: court.nombre,
      horaInicio: court.horaInicio,
      horaFinalizacion: court.horaFinalizacion,
      direccion : court.direccion,
      aforo: court.aforo,
      precioPorHora: court.precioPorHora,
      disponible: court.disponible,
      iluminacion: court.iluminacion,
      campoAbierto: court.campoAbierto,
      suelo_id: court.suelo_id,
      deporte_id: court.deporte_id
    }

    return this.http.put<any>(this.url + 'edit-court/' + id, data);
  }

  addImg(id: number, foto: File) {

    const formData = new FormData();
    formData.append('foto', foto);

    return this.http.post<any>(this.url + 'add-image/' + id, formData);
  }

  delImg(id: number) {
    return this.http.post<any>(this.url + 'remove-image/' + id, {});
  }

  delCourt(id:number) {
    return this.http.delete<any>(this.url + 'delete-court/' + id);
  }
}
