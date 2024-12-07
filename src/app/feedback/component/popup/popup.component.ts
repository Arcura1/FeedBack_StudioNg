import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  isVisible: boolean = false;

  showPopup() {
    this.isVisible = true;
  }

  closePopup() {
    this.isVisible = false;
  }
}
