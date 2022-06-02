import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public url: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  addComment(court_id: number, comment: any) {
    let data = {
      texto: comment.text,
      like: comment.like
    }

    return this.http.post<any>(this.url + 'add-comment/' + court_id, data);
  }

  getComments(id_pista: number) {
    return this.http.get<any>(this.url + 'get-comments/' + id_pista);
  }

  delComment(id: number) {
    return this.http.delete<any>(this.url + "delete-comment/" + id)
  }
}
