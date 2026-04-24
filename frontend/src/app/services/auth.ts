import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'https://localhost:7178';
  

  constructor(private http: HttpClient) {}

 login(data: { email: string; password: string }) : Observable<any>
{
  return this.http.post(`${this.baseUrl}/login`, data, {
    withCredentials: true
  });
}

register(data: { email: string; password: string }) : Observable<any>{
  return this.http.post(`${this.baseUrl}/register`, data, {
    withCredentials: true
  });
}

user() : Observable<any>{
  return this.http.get<any>(`${this.baseUrl}/me`, {
      withCredentials: true
    });
}

logout() : Observable<any>{
  return this.http.post(`${this.baseUrl}/logout`, {}, {withCredentials : true});
}

}
