import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component'; // PopupComponent'i import et

@Component({
  selector: 'mainPage',
  templateUrl: './mainPage.component.html',
  styleUrls: ['./mainPage.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent;

  constructor(private router: Router) {}
  public user :any;
  // Bileşen yüklendiğinde kullanıcı oturum bilgilerini al
  ngOnInit(): void {
     this.user= JSON.parse(sessionStorage.getItem('user') || '{}'); // Oturum verilerini JSON olarak al


    console.log('Kullanıcı ID:', this.user.id);
    console.log('Kullanıcı Adı:', this.user.firstName);
    console.log('Kullanıcı Rolü:', this.user.role);
  }

  // Student sayfasına yönlendirme
  goToStudent() {
    this.router.navigate(['/feedback/student']);
  }


  closePopup() {
    this.popup.closePopup();
  }
  goToTeacher() {
    this.router.navigate(['/feedback/teacher']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToExecutive() {
    this.router.navigate(['/executive']);
  }
}
