import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PopupTeacherComponent } from "../popupteacher/popupteacher.component";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
})
export class TeacherComponent implements OnInit {
  @ViewChild('popup') popup!: PopupTeacherComponent;
  id: string = '';
  homeworkTitle: string = '';
  homeworkDescription: string = '';
  teacherHomeworks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.id = user.id;

    this.http.get<any[]>('http://localhost:8080/Homework/getAll').subscribe(
      (data) => {
        this.teacherHomeworks = data.filter(
          (homework) => homework.teacher?.id === this.id
        );
      },
      (error) => {
        console.error('Hata:', error);
        alert('Ödevleri alırken bir hata oluştu.');
      }
    );
  }

  sendHomework(): void {
    if (!this.homeworkTitle || !this.homeworkDescription) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const newHomework = {
      title: this.homeworkTitle,
      description: this.homeworkDescription,
      teacherId: this.id,
    };

    this.http.post('http://localhost:8080/Homework/add', newHomework).subscribe(
      (response) => {
        alert('Ödev başarıyla gönderildi!');
        this.homeworkTitle = '';
        this.homeworkDescription = '';
        this.teacherHomeworks.push(newHomework);
      },
      (error) => {
        console.error('Hata:', error);
        alert('Ödev gönderilemedi.');
      }
    );
  }

  openPopup(homework: any): void {
    this.popup.openPopup(homework);
  }
}
