import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
declare const pdfjsLib: any;
import { PDFDocumentProxy,PageViewport } from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  @ViewChild('pdfCanvas', { static: false }) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

  // ngOnInit(): void {
  //   const url = 'https://pdfobject.com/pdf/sample.pdf'; // PDF dosya URL'si
  //   const loadingTask = pdfjsLib.getDocument(url);
  //
  //   loadingTask.promise.then(
  //     (pdf: PDFDocumentProxy) => {
  //       // PDF başarıyla yüklendiğinde burası çalışır
  //       console.log('PDF gelmiş');
  //     },
  //     (reason: any) => {
  //       // Hata oluşursa burası çalışır
  //       console.error('PDF yüklenemedi: ' + reason);
  //     }
  //   );
  //
  // }

  constructor() {}

  ngOnInit(): void {
    const url = 'https://pdfobject.com/pdf/sample.pdf'; // PDF dosya URL'si
    const loadingTask = pdfjsLib.getDocument(url);

    loadingTask.promise.then(
      (pdf: PDFDocumentProxy) => {
        console.log('PDF gelmiş');
        console.log(pdf);
        this.renderPage(pdf, 1); // 1. sayfayı render et
      },
      (reason: any) => {
        console.error('PDF yüklenemedi: ' + reason);
      }
    );
  }

  renderPage(pdf: PDFDocumentProxy, pageNumber: number) {
    pdf.getPage(pageNumber).then((page) => {
      const scale = 1.5; // Ölçek ayarı
      const viewport = page.getViewport({ scale });

      // Canvas elemanını seç
      const canvas = this.pdfCanvasRef.nativeElement; // @ViewChild ile elde edilen referans
      const context = canvas.getContext('2d');

      // context'in null olmadığını kontrol et
      if (context) {
        // Canvas boyutlarını ayarla
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Sayfayı render et
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
        console.log('Sayfa render edildi');
      } else {
        console.error('Canvas context alınamadı');
      }
    });
  }

}
