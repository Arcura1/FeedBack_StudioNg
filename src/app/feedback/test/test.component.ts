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

  }

}
