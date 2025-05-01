import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ClassroomUser} from "../queryModel/ClassroomUser";

@Injectable({ providedIn: 'root' })
export class ClassroomUserService {
  private baseUrl = 'http://localhost:8080/classroom-users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClassroomUser[]> {
    return this.http.get<ClassroomUser[]>(this.baseUrl);
  }

  getById(id: number): Observable<ClassroomUser> {
    return this.http.get<ClassroomUser>(`${this.baseUrl}/${id}`);
  }

  create(user: ClassroomUser): Observable<ClassroomUser> {
    return this.http.post<ClassroomUser>(this.baseUrl, user);
  }

  update(id: number, user: ClassroomUser): Observable<ClassroomUser> {
    return this.http.put<ClassroomUser>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
