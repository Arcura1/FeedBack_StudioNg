import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PDFDocumentProxy, PDFPageProxy, PDFDocumentLoadingTask } from 'pdfjs-dist';
import html2canvas from 'html2canvas';
import {ActivatedRoute} from "@angular/router";

declare const pdfjsLib: any;


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  homeworkId: string = '675f33bf4f98a22eedc79589';  // Default ID
  pdfInfoId: string = '675f33c84f98a22eedc7958a'; // Default ID
  pdfUrl: string | null = null;

  constructor(private http: HttpClient) {}

  fetchPdf(): void {
    // Endpoint URL
    const url = 'http://localhost:8080/pdf/pdfById';

    // JSON verisi oluşturuluyor
    const data = {
      homeworkId: this.homeworkId,
      pdfInfoId: this.pdfInfoId
    };

    // Request ayarları
    this.http.post(url, data, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        // PDF blob'unu URL olarak oluştur
        this.pdfUrl = URL.createObjectURL(blob);

        // PDF'i render et
        this.renderPdf(this.pdfUrl);
      },
      error: (err: any) => {
        alert('PDF yüklenirken bir hata oluştu: ' + err.message);
      }
    });
  }

  renderPdf(pdfUrl: string | null): void {
    if (!pdfUrl) return;

    // PDF.js ile PDF yükleme
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then((pdf:PDFDocumentProxy) => {
      console.log('PDF yüklendi');

      // İlk sayfayı almak
      pdf.getPage(1).then((page:PDFPageProxy) => {
        console.log('Sayfa yüklendi');

        // Canvas'ı al
        const canvas: HTMLCanvasElement = document.getElementById('pdf-render') as HTMLCanvasElement;
        const context = canvas.getContext('2d')!;

        // Sayfa büyüklüğü
        const scale = 1.5;  // Sayfa ölçeği
        const viewport = page.getViewport({ scale: scale });

        // Canvas boyutlarını ayarlama
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Sayfayı render et
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);

        // Canvas'ı görünür hale getir
        canvas.style.display = 'block';
      });
    }).catch((error:any) => {
      console.error('PDF yükleme hatası:', error);
      alert('PDF yüklenemedi');
    });
  }
}
