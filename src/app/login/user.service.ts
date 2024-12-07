import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../login/user'; // Kullanıcı modelini kendi yoluna göre ayarla


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // API URL

  constructor(private http: HttpClient) {}

  createUser(user: User) {
    return this.http.post(`${this.apiUrl}/create`, user);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials); // Giriş için API
  }
}
