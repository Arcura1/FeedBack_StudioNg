import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'] // 'styleUrls' kullanmalısınız
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToEntry() {
    this.router.navigate(['/login']); // Giriş sayfasına yönlendirme
  }

  goToRegister() {
    this.router.navigate(['/register']); // Kayıt sayfasına yönlendirme
  }
}
