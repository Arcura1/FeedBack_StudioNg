import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PopupStudentComponent } from './popupstudent/popupstudent.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  @ViewChild('popup') popup!: PopupStudentComponent;

  homeworks: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // sessionStorage'tan userId'yi al
    const userIdStr = sessionStorage.getItem('userId');

    // ID kontrolü
    if (!userIdStr || isNaN(+userIdStr)) {
      console.error('❌ Geçersiz veya eksik userId bilgisi!');
      return;
    }

    const userId = Number(userIdStr);

    // Kullanıcıya ait ödevleri getir
    this.http.get<any[]>(`http://localhost:8080/Homework/getByUser/${userId}`)
      .subscribe({
        next: (data) => {
          this.homeworks = data;
          if (data.length === 0) {
            console.warn('ℹ️ Kullanıcının ait olduğu sınıflarda ödev bulunamadı.');
          }
        },
        error: (err) => {
          console.error('❌ Ödevler yüklenemedi:', err);
        }
      });
  }

  goToPdfEdit(): void {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  showPopup(homework: any): void {
    this.popup.openPopup(homework);
  }
}
