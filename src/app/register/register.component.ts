import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    // Şifre kontrolü
    if (this.password !== this.confirmPassword) {
      document.getElementById('message')!.innerHTML = 
        '<div class="alert alert-danger">Şifreler eşleşmiyor!</div>';
      return;
    }

    // Tüm alanların doldurulduğunu kontrol et
    if (!this.name || !this.email || !this.password || !this.role) {
      document.getElementById('message')!.innerHTML = 
        '<div class="alert alert-danger">Lütfen tüm alanları doldurun!</div>';
      return;
    }

    // Kayıt işlemleri burada yapılacak
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Role:', this.role);
    
    // Örnek bir kayıt işlemi
    // Gerçek uygulamada bu kısım API'ye bağlanacak
    this.router.navigate(['/login']);
  }
}
