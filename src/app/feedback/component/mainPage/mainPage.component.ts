import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mainPage',
  templateUrl: 'mainPage.component.html',
})
export class MainPageComponent implements OnInit {
  constructor(private router: Router) {}

  // Bileşen yüklendiğinde kullanıcı oturum bilgilerini al
  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}'); // Oturum verilerini JSON olarak al

    console.log('Kullanıcı ID:', user.id);
    console.log('Kullanıcı Adı:', user.firstName);
    console.log('Kullanıcı Rolü:', user.role);
  }

  // Student sayfasına yönlendirme
  goToStudent() {
    this.router.navigate(['/feedback/student']);
  }
}
