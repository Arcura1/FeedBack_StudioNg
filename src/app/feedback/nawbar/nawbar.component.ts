import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'nawbarfeed',
  templateUrl: './nawbar.components.html'
})
export class NavbarComponent implements OnInit{

  public user :any;


  ngOnInit(): void {
    this.user= JSON.parse(sessionStorage.getItem('user') || '{}'); // Oturum verilerini JSON olarak al
  }
  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/feedback/profile'], { skipLocationChange: true });
  }

  goToMain() {
    this.router.navigate(['/feedback']);
  }
  goToClassroom() {
    this.router.navigate(['/feedback/classroom'], { skipLocationChange: true });
  }
  goToUsermanagement() {
    this.router.navigate(['/feedback/usermanagement'], { skipLocationChange: true });
  }
  goToOrganization() {
    this.router.navigate(['/feedback/organization'], { skipLocationChange: true });
  }

logout() {
  sessionStorage.clear(); // Tüm session'ı temizle
  localStorage.clear();   // Varsa localStorage da temizlenir
  this.router.navigate(['/login']); // Giriş ekranına yönlendir
}

}
