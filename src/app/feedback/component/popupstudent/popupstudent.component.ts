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
  userId: string = '';

  constructor(private http: HttpClient, private router: Router) {

  }

  ngOnInit(): void {
    // Kullanıcı ID'sini sessionStorage veya localStorage'dan al
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userId = user?.id || 'Bilinmiyor'; // Eğer ID yoksa varsayılan değer
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

    const reader = new FileReader();

    // Dosyayı Base64 formatına çevir
    reader.onload = () => {
      const base64File = reader.result as string;

      // JSON formatında veri oluştur
      const payload = {
        title: this.homework?.title || '',
        content: this.homework?.description || '',
        xsize: '1', // Statik değer
        ysize: '7', // Statik değer
        pageSize: '1', // Statik değer
        homeworkId: this.homework?.id || '',
        userId: this.userId || '',
        file: base64File.split(',')[1], // Base64 içeriği (başındaki `data:...;base64,` kısmı çıkarılır)
      };

      // HTTP isteğini gönder
      this.http.post('http://localhost:8080/pdf/addPdf', payload).subscribe(
        (response) => {
          console.log(response);
          alert('PDF başarıyla gönderildi!');
        },
        (error) => {
          console.error('Hata:', error);
          alert('PDF gönderilemedi!');
        }
      );
    };

    reader.onerror = (error) => {
      console.error('Dosya okunamadı:', error);
      alert('Dosya okunamadı!');
    };

    // Dosyayı oku
    reader.readAsDataURL(this.selectedFile);
  }

}
