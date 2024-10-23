import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import {NavbarComponent} from "./component/nawbar/nawbar.component";
import {LnawbarComponent} from "./component/mainPage/component/Lnawbar/Lnawbar.component";
import {RnawbarComponent} from "./component/pdfEditPage/Rnawbar/Rnawbar.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {ProfileComponent} from "./component/Profile/profle.component";
import {PdfEditComponent} from "./component/pdfEditPage/./pdfEdit.component";
import { NavigatorPageComponent } from './component/mainPage/component/navigator-page/navigator-page.component';



@NgModule({
  declarations: [
    FeedbackComponent,
    MainPageComponent,
    ProfileComponent,
    NavigatorPageComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    NavbarComponent,
    LnawbarComponent,
    RnawbarComponent,
    PdfEditComponent
  ]
})
export class FeedbackModule { }
