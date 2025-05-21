import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'adminPage',
  templateUrl: './adminPage.component.html',
  styleUrls: ['./adminPage.component.css']
})
export class AdminPageComponent implements OnInit {
  user: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');

    console.log('Admin Paneli - Kullanıcı ID:', this.user.id);
    console.log('Admin Paneli - Kullanıcı Adı:', this.user.firstName);
    console.log('Admin Paneli - Rol:', this.user.role);
  }

  goToAdmin() {
    this.router.navigate(['/admin/settings']); // ihtiyaca göre yönlendir
  }
}
