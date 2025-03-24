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
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>('http://localhost:8080/api/users');
}

updateUserRole(id: number, newRole: string): Observable<User> {
  return this.http.put<User>(`http://localhost:8080/api/users/update-role/${id}`, { role: newRole });
}

getAllRoles(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8080/roles');
}



}
