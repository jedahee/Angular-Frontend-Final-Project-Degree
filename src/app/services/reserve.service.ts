import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  public url: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  getReserves() {
    return this.http.get<any>(this.url + 'get-bookings');
  }
  
  getReservesByUser(id: number) {
    return this.http.get<any>(this.url + 'get-booking-user/' + id);
  }

  getReservesByCourt(id: number) {
    return this.http.get<any>(this.url + 'get-booking-court/' + id);
  }

  existsReserve(user_id: number, court_id: number) {
    return this.http.get<any>(this.url + 'exists-reserve/' + court_id + "/" + user_id);
  }

  delReserve(id: number) {
    return this.http.delete<any>(this.url + 'delete-reserve/' + id);
  }

  addReserve(objReserve: any) {
    let data = {
      horaFinalizacion: objReserve.horaFinalizacion,
      horaInicio: objReserve.horaInicio,
      fechaCita: objReserve.fechaCita,
      numLista: objReserve.numLista,
      users_id: objReserve.users_id,
      pistas_id: objReserve.pistas_id,
    }

    console.log(data);

    return this.http.post<any>(this.url + 'add-reserve', data);
  }
}
