import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PDFDocumentProxy} from 'pdfjs-dist';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import html2canvas from 'html2canvas';



declare const pdfjsLib: any;


@Component({
  selector: 'Pdf-Edit',
  templateUrl: './pdfEdit.component.html',
  styleUrls: ['./pdfEdit.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
})
export class PdfEditComponent implements OnInit {

  @ViewChild('canvasContainer', {static: true}) canvasContainerRef!: ElementRef;
  @ViewChild('pdfCanvas', {static: false}) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

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
  public isPopupOpen = false; // Pop-up'ın açık olup olmadığını kontrol eden değişken
  public modeSelect: number = 0;
  public isMouseDown: boolean = false;
  public startX: number;
  public startY: number;


  constructor() {
    this.startY = 0;
    this.startX = 0;

    this.pdfX = 0; // Özellik constructor'da başlatıldı
    this.pdfY = 0;
  }

  ngOnInit(): void {


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
          for (const item of data) {
            const button = document.createElement('button');
            button.className = 'btn btn-success position-absolute';
            button.textContent = item.note;
            // Butonu tıklanan konuma yerleştir
            console.log(item);
            button.style.left = `${item.xcoordinate}px`;
            button.style.top = `${item.ycoordinate}px`;
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

  openPopup() {
    this.isPopupOpen = !this.isPopupOpen; // Pop-up'ı aç
  }

  closePopup() {
    this.isPopupOpen = false; // Pop-up'ı kapat
  }

  onSubmitNote() {
    console.log('Form gönderildi');
    this.closePopup(); // Form gönderildikten sonra pop-up'ı kapat
  }

  higlihtMode() {
    this.modeSelect = 1;
  }

  noteMode() {
    this.modeSelect = 0;
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
        highlightDiv.style.opacity = '0.5';

        highlightDiv.style.left = Math.min(this.startX, endX) + 'px';
        highlightDiv.style.top = Math.min(this.startY, endY) + 'px';
        highlightDiv.style.width = Math.abs(endX - this.startX) + 'px';
        highlightDiv.style.height = Math.abs(endY - this.startY) + 'px';

        this.canvasContainerRef.nativeElement.appendChild(highlightDiv);
      }
    }
  }

  mouseDown($event: MouseEvent) {
    if (this.modeSelect == 1) {
      this.isMouseDown = true;
      const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
      this.startX = $event.clientX - rect.left;
      this.startY = $event.clientY - rect.top;
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
}
