import {Component, OnInit} from "@angular/core";

@Component({
  selector:"profile",
  templateUrl:"profle.component.html"
})
export class ProfileComponent implements OnInit {
  user: any = {}; // Kullanıcı bilgilerini saklamak için değişken

  constructor() {}

  ngOnInit(): void {
    // `mainPage` bileşeninden oturumdaki kullanıcı bilgilerini al
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');

    console.log('Kullanıcı ID:', this.user.id);
    console.log('Kullanıcı Adı:', this.user.firstName);
    console.log('Kullanıcı Rolü:', this.user.role);
  }
}
