import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import {NavbarComponent} from "./component/nawbar/nawbar.component";
import {LnawbarComponent} from "./component/Lnawbar/Lnawbar.component";
import {RnawbarComponent} from "./component/Rnawbar/Rnawbar.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {ProfileComponent} from "./component/Profile/profle.component";



@NgModule({
  declarations: [
    FeedbackComponent,
    MainPageComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    NavbarComponent,
    LnawbarComponent,
    RnawbarComponent,
  ]
})
export class FeedbackModule { }
