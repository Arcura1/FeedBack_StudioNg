import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  // Pop-up mesajını tutan değişken
  popupMessage: string = '';

  // Pop-up'ı ekranda gösterme fonksiyonu
  showPopup(message: string): void {
    this.popupMessage = message;  // Mesajı güncelle
    const popupElement = document.getElementById('popup');

    if (popupElement) {
      popupElement.style.display = 'block';  // Pop-up'ı göster
    }
  }

  // Pop-up'ı gizleme fonksiyonu
  closePopup(): void {
    const popupElement = document.getElementById('popup');

    if (popupElement) {
      popupElement.style.display = 'none';  // Pop-up'ı gizle
    }
  }
}
