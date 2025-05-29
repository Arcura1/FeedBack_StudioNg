import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PopupTeacherComponent } from "./popupteacher/popupteacher.component";
import {ClassroomService} from "./service/classroom.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-teacher',
  templateUrl: './Teacher.component.html',
  styleUrls: ['./Teacher.component.css']
})
export class TeacherComponent implements OnInit {
  @ViewChild('popup') popup!: PopupTeacherComponent;
  id: string = '';
  homeworkTitle: string = '';
  homeworkDescription: string = '';
  teacherHomeworks: any[] = [];


  constructor(private http: HttpClient,private classroomService: ClassroomService,private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.id = user.id;

    this.http.get<any[]>('http://localhost:8080/homework/getAll').subscribe(
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
    // Buraya istediğin userId'yi yazabilirsin
    this.classroomService.getClassroomsByUserId(Number(this.id)).subscribe({
      next: (data) => {
        this.classrooms = data;
      },
      error: (err) => {
        console.error('API Hatası:', err);
      }
    });
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
    console.log(newHomework)
    this.http.post('http://localhost:8080/homework/add', newHomework).subscribe(
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

  goToTeacher() {
    this.router.navigate(['/feedback/teacher']);
  }

goToHomework(classroomId: number) {
  this.router.navigate(['/feedback/homework',classroomId]);
}

  classrooms: any[] = [];



}
