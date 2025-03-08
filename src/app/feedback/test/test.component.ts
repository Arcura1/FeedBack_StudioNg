import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PDFDocumentProxy, PDFPageProxy, PDFDocumentLoadingTask } from 'pdfjs-dist';
import html2canvas from 'html2canvas';
import {ActivatedRoute} from "@angular/router";
import {PopupTeacherComponent} from "../component/Teacher/popupteacher/popupteacher.component";

declare const pdfjsLib: any;


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  @Input() classroomId: number = 0;

  @ViewChild('popup') popup!: PopupTeacherComponent;
  id: string = '';
  homeworkTitle: string = '';
  homeworkDescription: string = '';
  teacherHomeworks: any[] = [];

  constructor(private http: HttpClient,private route: ActivatedRoute) {}

  ngOnInit(): void {
    const classroomId = this.route.snapshot.paramMap.get("classroomId")
    if(classroomId){
      this.classroomId= Number(classroomId)
    }


    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.id = user.id;

    this.http.get<any[]>('http://localhost:8080/Homework/getAllByT?teacherId='+this.id).subscribe(
      (data) => {
        console.log(data)
        this.teacherHomeworks = data
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
      classroomId: this.classroomId

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
