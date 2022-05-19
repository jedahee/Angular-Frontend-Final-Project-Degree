import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    let data = {
      email: email,
      password: password
    }

    return this.http.post<any>(this.url + 'login', data);
  }

  register(nombre: string, apellidos: string, email: string, password: string) {

    let data = {
      nombre: nombre,
      apellidos: apellidos,
      email: email,
      password: password,
      rol_id: 3
    }

    return this.http.post<any>(this.url + 'register', data);
  }

  forgotPassword(email: string) {
    return this.http.get<any>(this.url + 'forgot-password/' + email);
  }

  updatePassword(email: string, token: string, password: string) {
    let data = {
      password: password
    }
    return this.http.put<any>(this.url + 'update-password/' + email + "/" + token, data);
  }

  getUser(token: string) {
    let data = {
      token: token
    }
    return this.http.post<any>(this.url + 'get-user', data);
  }

  logout(token: string) {
    let data = {
      token: token
    }
    return this.http.post<any>(this.url + 'logout', data);
  }

  getWarnings() {
    return this.http.get<any>(this.url + 'get-warnings');
  }

  getRole() {
    return this.http.get<any>(this.url + 'get-role');
  }

  deleteAccount() {
    return this.http.delete<any>(this.url + 'delete-account');
  }

  editEmail(email: string) {
    let data = {
      email: email
    }

    return this.http.put<any>(this.url + 'edit-email/', data);
  }

  editUsername(firstName: string, lastName: string) {
    let data = {
      nombre: firstName,
      apellidos: lastName
    }

    return this.http.put<any>(this.url + 'edit-user/', data);
  }

  updateImg(foto_perfil: File) {

    const formData = new FormData();
    formData.append('foto_perfil', foto_perfil);

    return this.http.post<any>(this.url + 'upload-image/', formData);
  }

  deleteImg() {
    return this.http.delete<any>(this.url + 'delete-image/');
  }

  updateRole(id: number, rol_id: number) {
    let data = {
      rol_id: rol_id
    }

    return this.http.put<any>(this.url + 'update-role/' + id, data);
  }
}
