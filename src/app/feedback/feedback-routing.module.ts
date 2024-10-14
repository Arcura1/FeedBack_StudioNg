import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackComponent} from './feedback.component';
import {ProfileComponent} from "./component/Profile/profle.component";
import {MainPageComponent} from "./component/mainPage/mainPage.component";

const pageCode="feedback"
const routes: Routes = [
  {path: '', component:MainPageComponent },
  {path:'profile',component:ProfileComponent},
  {path:'main',component:MainPageComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {
}
