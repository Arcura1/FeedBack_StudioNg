import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector:"mainPage",
  templateUrl:"mainPage.component.html"
})
export class MainPageComponent{
constructor(private router: Router) {
}




  goToStudent() {
    this.router.navigate(['/feedback/student']);
  }
}
