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
    userId: number =0; // Kullanıcı ID'si
    uploadedPdfId: string | null = null; // Kaydedilen PDF ID'si
    pdfId: number = 0; // Store the fetched PDF ID
    donenData: any = {}; // json da dönen datayı buraya bastırıo
    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
      // Retrieve user ID from sessionStorage or localStorage
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      this.userId = user?.id || 'Bilinmiyor'; // Default value if ID is unavailable
      this.userId = user?.id || 'Bilinmiyor'; // Eğer ID yoksa varsayılan değer

      // Kaydedilen PDF ID'sini al
      this.uploadedPdfId = localStorage.getItem('uploadedPdfId');
    }

    // PDF düzenleme sayfasına git
    goToPdfEdit(): void {
      // Yeni parametreleri route state ile ilet
      this.router.navigate(['/feedback/PdfEdit', this.homework.id, this.pdfId]);
    }


    // Open the popup with homework details and fetch the PDF ID
    openPopup(homework: any): void {
      this.homework = homework;
      this.isVisible = true;
      this.fetchPdfId(); // Fetch the PDF ID from the database
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

    // Fetch the PDF ID from the database
    fetchPdfId(): void {
      const homeworkId = this.homework?.id || ''; // Ödev ID'sini al
      const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id; // Kullanıcı ID'sini al

      // URL'yi belirliyoruz
      const url = 'http://localhost:8080/pdf/findAllByHU';

      // Gönderilecek veri (body) hazırlanıyor
      const body = {
        homeworkId: homeworkId,
        userId: userId
      };

      // HTTP POST isteği gönderiyoruz
      this.http.post<any>(url, body).subscribe(
        (response) => {
          console.log('Gelen Cevap:', response); // Backend yanıtını logla
          try {
            if (response) {
              this.donenData = response; // JSON verisi geçerliyse donenData'ya ata
              this.pdfId = this.donenData?.id || ''; // Fetched PDF ID'yi ata
              console.log('Fetched PDF ID:', this.pdfId);
            } else {
              throw new Error('Geçersiz JSON formatı');
            }
          } catch (error) {
            console.error('Invalid response format:', error);
            this.donenData = ''; // Geçersiz JSON olduğunda donenData'yı sıfırla
            alert('Hatalı JSON formatı alındı!');
          }
        },
        (error) => {
          console.error('Failed to fetch PDF ID:', error);
          alert('PDF ID alınamadı!');
          this.donenData = ''; // Hata durumunda donenData'yı sıfırla
        }
      );

    }



    // Submit the homework with the uploaded file
    // Ödevi yükle ve backend'e gönder
    submitHomework(): void {
      if (!this.selectedFile) {
        alert('Lütfen bir dosya seçin!');
        return;
      }

      const reader = new FileReader();

      // Convert the file to Base64 format
      reader.onload = () => {
        const base64File = reader.result as string;

        // Create the payload in JSON format
        const payload = {
          title: this.homework?.title || '',
          content: this.homework?.description || '',
          xsize: 1,
          ysize: 7,
          pageSize: 1,
          homeworkId: this.homework?.id || '',
          userId: this.userId,
          pdfId: this.pdfId, // Include the fetched PDF ID
        };

        console.log('Payload to be sent:', payload);

        // Send the HTTP request
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
            console.error('Error:', error);
            alert('PDF gönderilemedi!');
          }
        );
      };

      reader.onerror = (error) => {
        console.error('Failed to read file:', error);
        alert('Dosya okunamadı!');
      };

      // Read the file
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
