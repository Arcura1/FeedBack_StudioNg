import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popup-teacher',
  templateUrl: './popupteacher.component.html',
  styleUrls: ['./popupteacher.component.css'],
})
export class PopupTeacherComponent {
  @Input() homework: any; // Açılacak ödev bilgisi
  isVisible: boolean = false; // Popup görünürlük durumu
  submittedPdfs: any[] = []; // Gönderilen PDF'ler

  constructor(private http: HttpClient) {}

  openPopup(homework: any): void {
    this.homework = homework; // Ödev bilgilerini ata
    this.isVisible = true; // Popup'ı görünür yap

    // Gönderilen PDF'leri çek
    this.http
      .get<any[]>(`http://localhost:8080/Homework/getSubmittedPdfs?homeworkId=${homework.id}`)
      .subscribe(
        (data) => {
          this.submittedPdfs = data;
        },
        (error) => {
          console.error('Hata:', error);
          alert('Gönderilen PDFler alınamadı.');
        }
      );
  }

  closePopup(): void {
    this.isVisible = false; // Popup'ı gizle
    this.submittedPdfs = []; // PDF listesini sıfırla
  }
}
