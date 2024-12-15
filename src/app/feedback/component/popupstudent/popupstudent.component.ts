import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {response} from "express";

interface ResponseData {
  setId: string; // Gelen yanıt içindeki setId değeri
}

@Component({
  selector: 'app-popup-student',
  templateUrl: './popupstudent.component.html',
  styleUrls: ['./popupstudent.component.css'],
})
export class PopupStudentComponent {
  @Input() homework: any; // Popup içinde gösterilecek ödev detayları
  isVisible: boolean = false; // Popup görünürlük durumu
  selectedFile: File | null = null; // Yüklenmek üzere seçilen dosya
  userId: string = ''; // Kullanıcı ID'si
  uploadedPdfId: string | null = null; // Kaydedilen PDF ID'si

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Kullanıcı ID'sini sessionStorage veya localStorage'dan al
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userId = user?.id || 'Bilinmiyor'; // Eğer ID yoksa varsayılan değer

    // Kaydedilen PDF ID'sini al
    this.uploadedPdfId = localStorage.getItem('uploadedPdfId');
  }

  // PDF düzenleme sayfasına git
  goToPdfEdit() {
    this.router.navigate(['/feedback/PdfEdit']);
  }

  // Popup'ı aç ve ödev detaylarını göster
  openPopup(homework: any): void {
    this.homework = homework;
    this.isVisible = true;
  }

  // Popup'ı kapat ve seçilen dosyayı sıfırla
  closePopup(): void {
    this.isVisible = false;
    this.selectedFile = null;
  }

  // Dosya seçimi işleyici
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Ödevi yükle ve backend'e gönder
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
        title: this.homework?.title || 'Default Title',
        content: this.homework?.description || 'Default Content',
        xsize: 1,
        ysize: 7,
        pageSize: 1,
        homeworkId: this.homework?.id || '',
        userId: this.userId,
      };

      console.log('Gönderilen Payload:', payload);

      // HTTP isteğini gönder
      this.http.post<ResponseData>('http://localhost:8080/pdf/addPdf', payload).subscribe(
        (response) => {
          console.log('Gelen Cevap:', response);

          // Gelen setId değerini kaydet
          if (response.setId) {
            localStorage.setItem('uploadedPdfId', response.setId);
            this.uploadedPdfId = response.setId; // Popup içinde göstermek için
            console.log('setId kaydedildi:', response.setId);

            // PDF dosyasını `uploadPdfToBackend` fonksiyonu ile gönder
            if (this.selectedFile) {
              this.uploadPdfToBackend(response.setId, this.selectedFile);
            }
          }
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

// Yardımcı fonksiyon: PDF dosyasını setId ile backend'e gönder
  uploadPdfToBackend(Id: string, file: File): void {
    const formData = new FormData();
    formData.append('Id', Id); // setId'yi Id parametresine ekle
    formData.append('file', file); // PDF dosyasını ekle

    console.log('Gönderilen FormData:', formData);
    console.log('Id', Id);
    console.log('file', file)

    // HTTP POST isteği gönder
    this.http.post('http://localhost:8080/pdf/uploadPdf', formData).subscribe(
      (response) => {
        console.log('Dosya Yükleme Başarılı:', response);
        alert('PDF başarıyla yüklendi!');
      },
      (error) => {
        console.error('uploadPdf Hatası:', error);
        alert('PDF yüklenirken bir hata oluştu!');
      }
    );
  }

}
