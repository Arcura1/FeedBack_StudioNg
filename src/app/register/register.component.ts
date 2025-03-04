import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {UserService} from "../login/user.service";
import {User} from "../login/user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  firstName: string = ''; //
  lastName: string = ''; //
  email: string = ''; //
  phone: string = ''; //
  password: string = ''; //
  role: string = 'student'; // Varsayılan olarak "student" rolü
  confirmPassword: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;



  private apiUrl = 'http://localhost:8080/api/users/create'; // Backend URL

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    // Şifre kontrolü
    if (this.password !== this.confirmPassword) {
      document.getElementById('message')!.innerHTML =
        '<div class="alert alert-danger">Şifreler eşleşmiyor!</div>';
      return;
    }

    // Tüm alanların doldurulduğunu kontrol et
    if (!this.firstName || !this.email || !this.password || !this.role) {
      document.getElementById('message')!.innerHTML =
        '<div class="alert alert-danger">Lütfen tüm alanları doldurun!</div>';
      return;
    }
    const newUser: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role // Kullanıcının seçtiği rol
    };

    this.http.post(this.apiUrl, newUser).subscribe(
      (response) => {
        console.log('Kayıt başarılı!', response);
        this.router.navigate(['/login']); // Kayıttan sonra giriş sayfasına yönlendirme
      },
      (error) => {
        console.error('Kayıt hatası:', error);
      }
    );

    // Kayıt işlemleri burada yapılacak
    console.log('Name:', this.firstName);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Role:', this.role);

    // Örnek bir kayıt işlemi
    // Gerçek uygulamada bu kısım API'ye bağlanacak
    this.router.navigate(['/login']);
  }





}
