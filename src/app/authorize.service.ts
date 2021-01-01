import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(public http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getAuthToken(username, password){
    return this.http.post('http://localhost:4200/api/v1/login', { ' username': username, ' password': password})
    .toPromise()
    .then((res) => {
      return JSON.stringify(res);
    }).catch((err) => {
      console.log(err);
    });
  }
}
