import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackComponent} from './feedback.component';
import {ProfileComponent} from "./component/Profile/profle.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";
import {StudentComponent} from "./component/student/student.component";
import {PdfEditComponent} from "./component/pdfEditPage/pdfEdit.component";
import {TeacherComponent} from "./component/Teacher/teacher.component";

const pageCode="feedback"
const routes: Routes = [
  { path: '',
    component:MainPageComponent,
    children:[
      {path:'',component:MainPageComponent},
      {path:'landing',component:MainPageComponent},


    ]
  },
  {path:'teacher',component:TeacherComponent},
  {path:'profile',component:ProfileComponent},
  {path:'student',component:StudentComponent},
  {path:'PdfEdit',component:PdfEditComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
