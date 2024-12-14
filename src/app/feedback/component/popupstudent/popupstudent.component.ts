import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-popup-student',
  templateUrl: './popupstudent.component.html',
  styleUrls: ['./popupstudent.component.css'],
})
export class PopupStudentComponent {
  @Input() homework: any; // Açılacak ödev bilgisi
  isVisible: boolean = false; // Popup görünürlük durumu
  selectedFile: File | null = null; // Seçilen dosya

  constructor(private http: HttpClient) {}

  openPopup(homework: any): void {
    this.homework = homework; // Ödev bilgilerini ata
    this.isVisible = true; // Popup'ı görünür yap
  }

  closePopup(): void {
    this.isVisible = false; // Popup'ı gizle
    this.selectedFile = null; // Dosya seçimini sıfırla
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitHomework(): void {
    if (!this.selectedFile) {
      alert('Lütfen bir dosya seçin!');
      return;
    }

    const formData = new FormData();
    formData.append('homeworkId', this.homework?.id);
    formData.append('file', this.selectedFile);
    formData.append('studentId', sessionStorage.getItem('user') || '');

    this.http.post('http://localhost:8080/Homework/submitPdf', formData).subscribe(
        (response) => {
          alert('Ödev başarıyla gönderildi!');
          this.closePopup();
        },
        (error) => {
          console.error('Hata:', error);
          alert('Ödev gönderilemedi.');
        }
    );
  }
}
