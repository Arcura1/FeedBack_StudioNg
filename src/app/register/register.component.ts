import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../login/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user'; //

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


  private apiUrl = 'http://localhost:8080/api/users/create'; // Backend URL

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  register() {
    const newUser: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: 'student'
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
  }
}
