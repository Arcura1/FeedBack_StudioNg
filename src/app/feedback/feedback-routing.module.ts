import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackComponent} from './feedback.component';
import {ProfileComponent} from "./component/Profile/profle.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {FlandingComponent} from "./component/mainPage/component/Flanding/Flanding";
import {PdfEditComponent} from "./component/mainPage/component/pdfEditPage/pdfEdit.component";
import {StudentComponent} from "./component/student/student.component";

const pageCode="feedback"
const routes: Routes = [
  { path: '',
    component:MainPageComponent,
    children:[
      {path:'',component:FlandingComponent},
      {path:'landing',component:FlandingComponent},
      {path:'PdfEdit',component:PdfEditComponent},
      {path:'student',component:StudentComponent},
    ]
  },
  {path:'profile',component:ProfileComponent},
  { path:'main',
    component:MainPageComponent,
    children:[
      {path:'',component:FlandingComponent},
      {path:'landing',component:FlandingComponent},
      {path:'PdfEdit',component:PdfEditComponent},
      {path:'student',component:StudentComponent},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
