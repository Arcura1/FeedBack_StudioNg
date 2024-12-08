import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  homeworkTitle: string = ''; // Ödev başlığı
  homeworkDescription: string = ''; // Ödev açıklaması
  id: string = ''; // Öğretmen ID
  allHomeworks: any[] = []; // Tüm ödevler

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Kullanıcı bilgilerini oturumdan al
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.id = user.id || ''; // ID'yi değişkene ata
    console.log('Teacher ID:', this.id);

    // Ödevleri veritabanından çek
    this.getAllHomeworks();
  }

  // Ödevleri veritabanından çekme fonksiyonu
  getAllHomeworks(): void {
    this.http.get('http://localhost:8080/Homework/getAll').subscribe(
      (response: any) => {
        this.allHomeworks = response; // Verileri al ve allHomeworks'a ata
        console.log('Ödevler:', this.allHomeworks);
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  // Ödevi gönderme fonksiyonu
  sendHomework(): void {
    if (!this.id) {
      alert('Teacher ID bulunamadı!');
      return;
    }

    const homeworkData = {
      title: this.homeworkTitle,
      description: this.homeworkDescription,
      teacherId: this.id, // Kullanıcının oturumdan alınan ID'si
    };

    this.http.post('http://localhost:8080/Homework/add', homeworkData).subscribe(
      (response) => {
        console.log('Başarılı:', response);
        alert('Ödev başarıyla gönderildi!');
        this.homeworkTitle = ''; // Alanları temizle
        this.homeworkDescription = '';
        this.getAllHomeworks(); // Yeni eklenen ödevle birlikte listeyi güncelle
      },
      (error) => {
        console.error('Hata:', error);
        alert('Ödev gönderilemedi!');
      }
    );
  }
}
