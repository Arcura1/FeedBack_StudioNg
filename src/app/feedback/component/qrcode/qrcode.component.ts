import { Component } from '@angular/core';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent {
  targetUrl: string = 'https://example.com'; // 🔁 QR yönlendirme adresi (istediğin URL)

  updateUrl(newUrl: string) {
    this.targetUrl = newUrl;
  }
}
