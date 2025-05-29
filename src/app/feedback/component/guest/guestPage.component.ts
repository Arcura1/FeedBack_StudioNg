import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'guestPage',
  templateUrl: './guestPage.component.html',
  styleUrls: ['./guestPage.component.css']
})
export class GuestPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Guest Paneli yüklendi.');
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
