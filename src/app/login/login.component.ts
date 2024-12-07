import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Doğru yazım
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  private apiUrl = 'http://localhost:8080/api/users/login';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const credentials = { email: this.email, password: this.password };

    this.http.post(this.apiUrl, credentials).subscribe(
      (response: any) => {
        console.log('Giriş başarılı!', response);

        // Kullanıcıyı sessionStorage'a kaydet
        sessionStorage.setItem('user', JSON.stringify(response));

        this.router.navigate(['/feedback']); // Başarılı giriş sonrası yönlendirme
      },
      (error) => {
        console.error('Giriş hatası:', error);
        alert('Giriş bilgilerinizi kontrol edin.'); // Hata mesajı
      }
    );
  }

  onSubmit() {
    this.login(); // Form gönderildiğinde login() fonksiyonunu çağır
  }
}
