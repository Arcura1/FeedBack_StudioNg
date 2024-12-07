import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import {NavbarComponent} from "./component/nawbar/nawbar.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {ProfileComponent} from "./component/Profile/profle.component";

import { StudentComponent } from './component/student/student.component';
import {PdfEditComponent} from "./component/pdfEditPage/pdfEdit.component";
import {TeacherComponent} from "./component/Teacher/teacher.component";
import {PopupComponent} from "./component/popup/popup.component";
import {FormsModule} from "@angular/forms";




@NgModule({
  declarations: [
    FeedbackComponent,
    MainPageComponent,
    ProfileComponent,
    StudentComponent,
    NavbarComponent,
    StudentComponent,
    TeacherComponent,
    PopupComponent,
    TeacherComponent,
    PdfEditComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    FormsModule,


  ]
})
export class FeedbackModule { }
