// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../login/user.service'; // UserService'i içe aktar
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; // Email
  password: string = ''; // Şifre

  private apiUrl = 'http://localhost:8080/api/users/login'; // Giriş API URL'si

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  login() {
    const userCredentials = {
      email: this.email,
      password: this.password
    };

    this.http.post(this.apiUrl, userCredentials).subscribe(
      (response) => {
        console.log('Giriş başarılı!', response);
        this.router.navigate(['/']); // Giriş başarılıysa ana sayfaya yönlendir
      },
      (error) => {
        console.error('Giriş hatası:', error);
      }
    );
  }
}
