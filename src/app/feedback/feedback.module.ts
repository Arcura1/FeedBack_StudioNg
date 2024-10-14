import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import {NavbarComponent} from "./nawbar/nawbar.component";
import {LnawbarComponent} from "./Lnawbar/Lnawbar.component";
import {RnawbarComponent} from "./Rnawbar/Rnawbar.component";



@NgModule({
  declarations: [
    FeedbackComponent
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
