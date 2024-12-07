import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
constructor(private router: Router) {
}
  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }
}
