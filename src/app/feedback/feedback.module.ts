import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import {NavbarComponent} from "./component/nawbar/nawbar.component";
import {LnawbarComponent} from "./component/mainPage/component/Lnawbar/Lnawbar.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {ProfileComponent} from "./component/Profile/profle.component";
import {PdfEditComponent} from "./component/mainPage/component/pdfEditPage/pdfEdit.component";



@NgModule({
  declarations: [
    FeedbackComponent,
    MainPageComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    NavbarComponent,
    LnawbarComponent,
    PdfEditComponent,
  ]
})
export class FeedbackModule { }
