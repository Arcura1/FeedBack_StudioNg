import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popup-student',
  templateUrl: './popupstudent.component.html',
  styleUrls: ['./popupstudent.component.css'],
})
export class PopupStudentComponent {
  @Input() homework: any; // Popup'ta gösterilecek ödev bilgisi
  isVisible: boolean = false; // Popup görünürlük durumu

  // Popup'ı açma
  openPopup(homework: any): void {
    this.homework = homework; // Ödev bilgilerini ayarla
    this.isVisible = true; // Popup'ı görünür yap
  }

  // Popup'ı kapatma
  closePopup(): void {
    this.isVisible = false; // Popup'ı gizle
  }

  // PDF yükleme
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Seçilen PDF:', file);
      alert('PDF Yüklendi: ' + file.name);
    }
  }
}
