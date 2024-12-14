import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-student',
  templateUrl: './popupstudent.component.html',
  styleUrls: ['./popupstudent.component.css'],
})
export class PopupStudentComponent {
  @Input() homework: any; // Homework details for the popup
  isVisible: boolean = false; // Popup visibility state
  selectedFile: File | null = null; // Selected file to be uploaded

  constructor(private http: HttpClient, private router: Router) {
  }

  // Navigate to PDF Edit Page
  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  // Open the popup with homework details
  openPopup(homework: any): void {
    this.homework = homework;
    this.isVisible = true;
  }

  // Close the popup and reset file selection
  closePopup(): void {
    this.isVisible = false;
    this.selectedFile = null;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Submit the homework with the uploaded file
  submitHomework(): void {
    if (!this.selectedFile) {
      alert('Lütfen bir dosya seçin!');
      return;
    }

    const formData = new FormData();
    const oray = 1; // Number değeri

    // FormData'ya değerleri eklerken number'ı string'e dönüştürüyoruz
    formData.append('title', this.homework?.title || '');
    formData.append('content', this.homework?.description || '');
    formData.append('xsize', oray.toString()); // Number => String dönüşümü
    formData.append('ysize', '7'); // Statik bir değer varsa direkt string olarak bırakabilirsiniz
    formData.append('pageSize', '1');
    formData.append('homeworkId', this.homework?.id || '');
    formData.append('file', this.selectedFile, this.selectedFile.name); // Dosya ekleme

    console.log(formData);

    this.http.post('http://localhost:8080/pdf/addPdf', formData).subscribe(
      (response: Object) => {
        console.log(response);
        alert('PDF başarıyla gönderildi!');
      },
      (error) => {
        console.error('Hata:', error);
        alert('PDF gönderilemedi!');
      }
    );
  }
}
