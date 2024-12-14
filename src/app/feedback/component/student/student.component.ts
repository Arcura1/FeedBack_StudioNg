import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PopupStudentComponent } from '../popupstudent/popupstudent.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  @ViewChild('popup') popup!: PopupStudentComponent; // Popup bileşenine erişim
  homeworks: any[] = []; // Homework listesini tutmak için değişken

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Backend'den homework verilerini çek
    this.http
      .get<any[]>('http://localhost:8080/Homework/getAll')
      .subscribe((data) => {
        this.homeworks = data;
      });
  }

  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  showPopup(homework: any): void {
    console.log('Popup açılıyor:', homework); // Debug için konsola yazdır
    this.popup.openPopup(homework); // Popup bileşenini aç
  }
}
