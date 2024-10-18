import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
declare const pdfjsLib: any;
import { PDFDocumentProxy,PageViewport } from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'Pdf-Edit',
  templateUrl: './pdfEdit.component.html',
  styleUrls: ['./pdfEdit.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ],
})
export class PdfEditComponent implements OnInit {
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
  public url = 'http://localhost:8080/pdf'; // PDF dosya URL'si
  public loadingTask = pdfjsLib.getDocument(this.url);
  public currentPageNumber=1;
  public topPagepdf=1
  public pdfX:number;
  public pdfY:number
  public metin: any;
  public originalViewport: any;



  constructor() {

      this.pdfX = 0; // Özellik constructor'da başlatıldı
      this.pdfY=0;
  }
  ngOnInit(): void {


    this.loadingTask.promise.then(
      (pdf: PDFDocumentProxy) => {
        this.topPagepdf=pdf._pdfInfo.numPages
        console.log('PDF gelmiş');
        console.log(pdf);
        this.renderPage(pdf, this.currentPageNumber); // 1. sayfayı render et
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
      this.originalViewport = page.getViewport({ scale: 1 });
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



  pageChangeForvard() {
    if(this.topPagepdf>this.currentPageNumber){
      this.currentPageNumber++;
    }

    this.loadingTask.promise.then(
      (pdf: PDFDocumentProxy) => {
        console.log('PDF gelmiş');
        console.log(pdf);
        this.renderPage(pdf, this.currentPageNumber); // 1. sayfayı render et
      },
      (reason: any) => {
        console.error('PDF yüklenemedi: ' + reason);
      }
    );
  }

  pageChangeBackvard() {
    if(1>=this.currentPageNumber){

    }else{
      this.currentPageNumber--;
    }

    this.loadingTask.promise.then(
      (pdf: PDFDocumentProxy) => {
        console.log('PDF gelmiş');
        console.log(pdf);
        this.renderPage(pdf, this.currentPageNumber); // 1. sayfayı render et
      },
      (reason: any) => {
        console.error('PDF yüklenemedi: ' + reason);
      }
    );
  }

  onSubmit() {
  console.log("oray")
    // Formdaki input değerini al


    // Gönderilecek JSON verisi
    const data = {
      xcoordinate: this.pdfX,
      ycoordinate: this.pdfY,
      note: this.metin,  // Kullanıcının girdiği metni al
      pdfId: 123
    };
    console.log(data)
    // PUT isteği gönder
    fetch("http://localhost:8080/add", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)  // Veriyi JSON formatında gönder
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log("Başarılı:", data);
        alert("Veri başarıyla gönderildi!");
      })
      .catch((error) => {
        console.error("Hata:", error);
        alert("Veri gönderilirken bir hata oluştu!");
      });
  }

  pdfLocationUpdate($event: MouseEvent) {
    const rect = this.pdfCanvasRef.nativeElement.getBoundingClientRect();
    const x = $event.clientX - rect.left;
    const y = $event.clientY - rect.top;


    this.pdfX = (x / rect.width) * this.originalViewport.width;
    this.pdfY = (y / rect.height) * this.originalViewport.height;

    console.log(`Tıklanan PDF Koordinatları X: ${this.pdfX.toFixed(2)}, Y: ${this.pdfY.toFixed(2)}`);
  }
}
