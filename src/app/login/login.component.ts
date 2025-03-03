import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  private apiUrl = 'http://localhost:8080/api/users/login'; // Backend URL

  constructor(private http: HttpClient, private router: Router) {}

  // Kullanıcı giriş işlemi
  login() {
    const credentials = { email: this.email, password: this.password };

    this.http.post(this.apiUrl, credentials).subscribe(
      (response: any) => {
        console.log('Giriş başarılı!', response);

        // Gelen kullanıcı yanıtını sessionStorage'a kaydet
        this.setUserSession(response);

        // Başarılı giriş sonrası yönlendirme
        this.router.navigate(['/feedback']);
      },
      (error) => {
        console.error('Giriş hatası:', error);
        alert('Giriş bilgilerinizi kontrol edin.');
      }
    );
  }

  // Kullanıcı bilgilerini sessionStorage'da sakla
  private setUserSession(user: any) {
    const sessionData = {
      id: user.id,
      firstName: user.firstName,
      role: user.role,
      email: user.email,
    };

    sessionStorage.setItem('user', JSON.stringify(sessionData));
    console.log('Kullanıcı oturumu ayarlandı:', sessionData);
  }

  // Form gönderildiğinde login fonksiyonunu çağır
  onSubmit() {
    this.login();
  }
}
