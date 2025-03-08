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
    this.router.navigate(['/feedback/profile']);
  }

  goToMain() {
    this.router.navigate(['/feedback']);
  }
  goToClassroom() {
    this.router.navigate(['/feedback/classroom']);
  }
  goToOrganization() {
    this.router.navigate(['/feedback/organization']);
  }


  goToHomework() {
    const classroomId = 1;

    this.router.navigate(['/feedback/homework',classroomId]);
  }
}
