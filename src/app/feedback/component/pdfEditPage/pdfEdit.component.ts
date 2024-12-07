import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PDFDocumentProxy} from 'pdfjs-dist';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {FeedbackModule} from "../../feedback.module";
import {NavbarComponent} from "../nawbar/nawbar.component";
import { PopupComponent } from '../popup/popup.component';

declare const pdfjsLib: any;


@Component({
  selector: 'Pdf-Edit',
  templateUrl: './pdfEdit.component.html',
  styleUrls: ['./pdfEdit.component.css']
})
export class PdfEditComponent implements OnInit {

  @ViewChild('canvasContainer', {static: true}) canvasContainerRef!: ElementRef;
  @ViewChild('pdfCanvas', {static: false}) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('popup') popup!: PopupComponent;

  public parentMessage: string = 'Merhaba, bu bir @Input örneğidir!';
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
  public currentPageNumber = 1;
  public topPagepdf = 1
  public pdfX: number;
  public pdfY: number;
  public metin: any;
  public originalViewport: any;
  public isPopupOpena = false; // Pop-up'ın açık olup olmadığını kontrol eden değişken
  public modeSelect: number = 0;
  public isMouseDown: boolean = false;
  public startX: number;
  public startY: number;
  // public isDrawing: boolean=false;
  // public ctx: CanvasRenderingContext2D | null = null;
  public isDrawing: boolean=false;


  constructor(private renderer:  Renderer2, private elementRef: ElementRef) {
    this.startY = 0;
    this.startX = 0;

    this.pdfX = 0; // Özellik constructor'da başlatıldı
    this.pdfY = 0;
  }

  ngOnInit(): void {
    // this.ctx=this.pdfCanvasRef.nativeElement.getContext('2d');

    this.loadingTask.promise.then(
      (pdf: PDFDocumentProxy) => {
        this.topPagepdf = pdf._pdfInfo.numPages
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
      const viewport = page.getViewport({scale});
      this.originalViewport = page.getViewport({scale: 1});
      // Canvas elemanını seç
      const canvas = this.pdfCanvasRef.nativeElement; // @ViewChild ile elde edilen referans
      const context = canvas.getContext('2d');


      fetch('http://localhost:8080/viewAll')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Gelen veriyi for döngüsü ile tek tek yazdır
          console.log(data)
          const rect = this.pdfCanvasRef.nativeElement.getBoundingClientRect();
          for (const item of data) {
            const button = document.createElement('button');
            button.className = 'btn btn-success position-absolute';
            button.textContent = item.note;
            button.id='notes'

            // Butonu tıklanan konuma yerleştir

            button.style.left = `${((item.xcoordinate / this.originalViewport.width) * rect.width )}px`;
            button.style.top = `${((item.ycoordinate / this.originalViewport.height) * rect.height )}px`;
            this.canvasContainerRef.nativeElement.appendChild(button)
            // console.log(item);
          }
        })
        .catch(error => {
          console.error('Veri alınırken bir hata oluştu:', error);
        });

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
        page.render(renderContext).promise.then(() => {
          // Sayfada kelimelerin konumlarını almak için metin içeriğini alıyoruz
          page.getTextContent().then((textContent) => {
            textContent.items.forEach((item) => {
              if ('str' in item && 'transform' in item) {  // `item`'in `TextItem` olup olmadığını kontrol ediyoruz
                const text = item.str;
                const transform = item.transform;
                // Bu noktada `text` ve `transform` ile işlemlere devam edebilirsiniz

                // Her kelime için konum
                const x = transform[4] * scale;
                const y = transform[5] * scale;
                const ctx = this.pdfCanvasRef.nativeElement.getContext('2d');

                if (ctx) {
                  // Kelimenin altını çiz (çizgi genişliği ve yüksekliği kelimenin boyutuna göre)


                  ctx.strokeStyle = 'red';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(x, canvas.height - y); // Başlangıç noktası
                  ctx.lineTo(x + (text.length * 7 * scale), canvas.height - y); // Kelime uzunluğu kadar yatay çizgi
                  ctx.stroke();
                }
              }
            });
          });
        });
        console.log('Sayfa render edildi');
      } else {
        console.error('Canvas context alınamadı');
      }
    });

  }


  pageChangeForvard() {
    if (this.topPagepdf > this.currentPageNumber) {
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
    if (1 >= this.currentPageNumber) {

    } else {
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
    if (this.modeSelect == 0) {
      const rect = this.pdfCanvasRef.nativeElement.getBoundingClientRect();
      const x = $event.clientX - rect.left;
      const y = $event.clientY - rect.top;

      this.pdfX = (x / rect.width) * this.originalViewport.width;
      this.pdfY = (y / rect.height) * this.originalViewport.height;

      console.log(`Tıklanan PDF Koordinatları X: ${this.pdfX.toFixed(2)}, Y: ${this.pdfY.toFixed(2)}`);
    }
  }

  openPopupa() {
    this.isPopupOpena = !this.isPopupOpena; // Pop-up'ı aç
  }

  closePopupa() {
    this.isPopupOpena = false; // Pop-up'ı kapat
  }

  onSubmitNote() {
    console.log('Form gönderildi');
    this.closePopupa(); // Form gönderildikten sonra pop-up'ı kapat
  }

  higlihtMode() {
    this.modeSelect = 1;
  }

  noteMode() {
    this.modeSelect = 0;
  }
  cizgiMode($event: MouseEvent) {
    this.modeSelect = 2;
  }
  mouseup($event: MouseEvent) {
    if (this.modeSelect == 1) {
      if (this.isMouseDown) {
        this.isMouseDown = false;

        const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
        const endX = $event.clientX - rect.left;
        const endY = $event.clientY - rect.top;

        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'position-absolute bg-warning';
        highlightDiv.id = 'button';
        highlightDiv.style.opacity = '0.5';

        highlightDiv.style.left = Math.min(this.startX, endX) + 'px';
        highlightDiv.style.top = Math.min(this.startY, endY) + 'px';
        highlightDiv.style.width = Math.abs(endX - this.startX) + 'px';
        highlightDiv.style.height = Math.abs(endY - this.startY) + 'px';

        this.canvasContainerRef.nativeElement.appendChild(highlightDiv);
      }
    }
    else if(this.modeSelect==2){
      this.isDrawing = false;
    }
  }

  mouseDown($event: MouseEvent) {
    if (this.modeSelect == 1) {
      this.isMouseDown = true;
      const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
      this.startX = $event.clientX - rect.left;
      this.startY = $event.clientY - rect.top;
    }
    else if(this.modeSelect==2){
      this.isDrawing = true;
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.beginPath();
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.moveTo($event.offsetX, $event.offsetY);
    }
  }

  download($event: MouseEvent) {
    html2canvas(this.canvasContainerRef.nativeElement).then(canvas => {

      const link = document.createElement('a');
      link.download = 'highlighted_pdf.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }
  downloadWithoutButton($event: MouseEvent) {
    this.toggleVisibility();
    html2canvas(this.canvasContainerRef.nativeElement).then(canvas => {

      const link = document.createElement('a');
      link.download = 'highlighted_pdf.png';
      link.href = canvas.toDataURL();
      link.click();
    });
    this.toggleVisibility();
  }
  toggleVisibility() {
    const elements = this.elementRef.nativeElement.querySelectorAll('#notes');

    elements.forEach((element: HTMLElement) => {
      if (element.style.display === 'none') {
        // Görünür yap
        this.renderer.setStyle(element, 'display', 'block');
      } else {
        // Gizle
        this.renderer.setStyle(element, 'display', 'none');
      }
    });
  }

  // downloadWithoutButtonpdf($event: MouseEvent) {
  //   const canvas = this.pdfCanvasRef.nativeElement;
  //   const pdf = new jsPDF();
  //
  //   // Canvas'ı bir veri URL'sine dönüştür
  //   const imgData = canvas.toDataURL('image/png');
  //
  //   // PDF'in boyutunu canvas boyutuna ayarla
  //   const pdfWidth = canvas.width * 0.75; // px'den pt'ye çevir (1 px ≈ 0.75 pt)
  //   const pdfHeight = canvas.height * 0.75;
  //
  //   // Canvas görüntüsünü PDF'e ekle
  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //
  //   // PDF dosyasını indir
  //   pdf.save('canvas-output.pdf');
  // }

  mouseMove($event: MouseEvent) {
    if (this.isDrawing&&this.modeSelect==2) {
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.lineTo($event.offsetX, $event.offsetY);
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.stroke();
    }
  }

  showPopup() {
    this.popup.showPopup();
  }

  closePopup() {
    this.popup.closePopup();
  }


}
