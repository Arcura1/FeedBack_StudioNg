import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PDFDocumentProxy} from 'pdfjs-dist';
import html2canvas from 'html2canvas';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

declare const pdfjsLib: any;

interface NoteItem {
  note: string;
  xcoordinate: number;
  ycoordinate: number;
  page: number;
  title: string;
  user: {
    email: string;
    firstName: string;
    id: number;
  }
}
interface highItem {
  id: String,
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  user: {
    email: string;
    firstName: string;
    id: string;
  }
  currentPage: number;
}

@Component({
  selector: 'Pdf-Edit',
  templateUrl: './pdfEdit.component.html',
  styleUrls: ['./pdfEdit.component.css']
})
export class PdfEditComponent implements OnInit {

  @ViewChild('canvasContainer', {static: true}) canvasContainerRef!: ElementRef;
  @ViewChild('pdfCanvas', {static: false}) pdfCanvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() pdfId: string = '';
  @Input() homeworkId: string = '';
  public pdfGetter = {

    homeworkId: this.homeworkId,
    pdfInfoId: this.pdfId
  }

  public url = 'http://localhost:8080/pdf/pdfById'; // PDF dosya URL'si
  public loadingTask = pdfjsLib.getDocument(this.url);
  public currentPageNumber = 1;
  public topPagepdf = 1
  public pdfX: number;
  public pdfY: number;
  public metin: any;
  public title: any;
  public originalViewport: any;
  public isPopupOpena = false; // Pop-up'ın açık olup olmadığını kontrol eden değişken
  public modeSelect: number = 0;
  public isMouseDown: boolean = false;
  public startX: number;
  public startY: number;
  public parentMessage: string = '';
  // public isDrawing: boolean=false;
  // public ctx: CanvasRenderingContext2D | null = null;
  public isDrawing: boolean = false;
  public showButtons: any[] = [];


  constructor(private renderer: Renderer2, private elementRef: ElementRef, private http: HttpClient, private route: ActivatedRoute) {
    const homeworkIdFromUrl = this.route.snapshot.paramMap.get('homeworkId');
    const pdfIdFromUrl = this.route.snapshot.paramMap.get('pdfId');

    // URL'den alınan parametreleri @Input() değerlerine atamak
    if (homeworkIdFromUrl) {
      this.homeworkId = homeworkIdFromUrl;
    }
    if (pdfIdFromUrl) {
      this.pdfId = pdfIdFromUrl;
    }
    this.pdfGetter.pdfInfoId = this.pdfId
    this.pdfGetter.homeworkId = this.homeworkId
    console.log(this.pdfGetter)
    this.http.post(this.url, this.pdfGetter, {responseType: 'blob'}).subscribe({
      next: (blob) => {
        // PDF blob'unu URL olarak oluştur
        console.log(blob)
        const pdfUrl = URL.createObjectURL(blob);
        // pdfjsLib ile PDF yükleme
        this.loadingTask = pdfjsLib.getDocument(pdfUrl);
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
      },
      error: (err: any) => {
        console.error('PDF istek hatası:', err);
      }
    });

    this.startY = 0;
    this.startX = 0;

    this.pdfX = 0; // Özellik constructor'da başlatıldı
    this.pdfY = 0;
  }

  ngOnInit(): void {
    // URL parametrelerini almak
    const homeworkIdFromUrl = this.route.snapshot.paramMap.get('homeworkId');
    const pdfIdFromUrl = this.route.snapshot.paramMap.get('pdfId');

    // URL'den alınan parametreleri @Input() değerlerine atamak
    if (homeworkIdFromUrl) {
      this.homeworkId = homeworkIdFromUrl;
    }
    if (pdfIdFromUrl) {
      this.pdfId = pdfIdFromUrl;
    }
    console.log(this.loadingTask)
    console.log(typeof this.loadingTask)
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
    this.updateParentMessage();
  }

  updateParentMessage() {
    this.parentMessage = `Tıklanan PDF Koordinatları X: ${this.pdfX.toFixed(2)}, Y: ${this.pdfY.toFixed(2)}`;
  }

  handleButtonClick(item: any) {
    const buttonId = item.id;  // Butonun ID'sini alın

    console.log('Butona tıklandı:', buttonId);  // Burada konsola tıklama işlemi geldiğini kontrol edin

    // API'den veri çekme
    fetch(`http://localhost:8080/view?NoteId=${buttonId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();  // JSON formatında veri döndür
      })
      .then(data => {
        // API'den gelen veriyi kontrol et
        if (data && data.note && data.xcoordinate !== undefined && data.ycoordinate !== undefined) {
          // Koordinatları ve notu konsola yazdır
          console.log(`Butona tıklandığında gelen veri: ${data.note}, Koordinatlar: X: ${data.xcoordinate}, Y: ${data.ycoordinate}`);
        } else {
          console.error('Veri yapısı beklenenden farklı: ', data);
        }
      })
      .catch(error => {
        console.error('Veri alınırken bir hata oluştu:', error);
        alert('Veri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
      });
  }

  showPopup(message: string) {
    const popupElement = document.getElementById('popup');
    const messageElement = document.getElementById('popup-message');

    if (popupElement && messageElement) {
      messageElement.textContent = message;  // Mesajı pop-up'a ekle
      popupElement.style.display = 'block';  // Pop-up'ı göster
    }
  }

  closePopup() {
    const popupElement = document.getElementById('popup');
    if (popupElement) {
      popupElement.style.display = 'none';  // Pop-up'ı gizle
    }
  }


  renderPage(pdf: PDFDocumentProxy, pageNumber: number) {
    pdf.getPage(pageNumber).then((page) => {
      const scale = 1.5; // Ölçek ayarı
      const viewport = page.getViewport({scale});
      this.originalViewport = page.getViewport({scale: 1});
      // Canvas elemanını seç
      const canvas = this.pdfCanvasRef.nativeElement; // @ViewChild ile elde edilen referans
      const context = canvas.getContext('2d');
      fetch('http://localhost:8080/highlights/viewH' + "/" + this.pdfId)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data:highItem[])=>{
              const elements = this.elementRef.nativeElement.querySelectorAll('#higlighta');
              elements.forEach((element: HTMLElement) => {
                element.remove();
              })

              data.forEach(value => {
                if(value.currentPage==this.currentPageNumber){
                  const highlightDiv = document.createElement('div');
                  highlightDiv.className = 'position-absolute bg-warning';
                  highlightDiv.id = 'higlighta';
                  highlightDiv.style.opacity = '0.5';

                  highlightDiv.style.left = Math.min(value.startX, value.endX) + 'px';
                  highlightDiv.style.top = Math.min(value.startY, value.endY) + 'px';
                  highlightDiv.style.width = Math.abs(value.endX - value.startX) + 'px';
                  highlightDiv.style.height = Math.abs(value.endY - value.startY) + 'px';

                  this.canvasContainerRef.nativeElement.appendChild(highlightDiv);

                  // else if(){
                  //
                  // }else if(){
                  //
                  // }
                // console.log(value);
                // const highlightDiv = document.createElement('div');
                // highlightDiv.className = 'position-absolute bg-warning';
                // highlightDiv.id = 'higlighta';
                // highlightDiv.style.opacity = '0.5';
                //
                // highlightDiv.style.left = Math.min(this.startX, value.endX) + 'px';
                // highlightDiv.style.top = Math.min(this.startY, value.endY) + 'px';
                // highlightDiv.style.width = Math.abs(value.endX - this.startX) + 'px';
                // highlightDiv.style.height = Math.abs(value.endY - this.startY) + 'px';
                //
                // this.canvasContainerRef.nativeElement.appendChild(highlightDiv);
                }
              })
        })




      fetch('http://localhost:8080/viewAll' + "/" + this.pdfId)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: NoteItem[]) => {
          console.log(data);
          const rect = this.pdfCanvasRef.nativeElement.getBoundingClientRect();

          // Modal ve close butonu elemanlarını seçiyoruz
          const modal = document.getElementById('modal');
          const closeBtn = document.getElementsByClassName('close')[0];
          const modalMessage = document.getElementById('modalMessage');
          // Modal ve modalMessage null ise, işlem yapma
          if (modal && modalMessage && closeBtn) {
            const elements = this.elementRef.nativeElement.querySelectorAll('#notes');
            elements.forEach((element: HTMLElement) => {
              element.remove();
            });
            data.forEach((item: NoteItem) => {
              console.log(item.page)
              console.log(this.currentPageNumber)
              if (item.page == this.currentPageNumber) {
                const button = document.createElement('button');
                button.className = 'btn btn-success position-absolute';
                button.textContent = `Not: ${item.title}`;
                button.id = 'notes';

                // Butonu doğru koordinatlarda yerleştir
                button.style.left = `${((item.xcoordinate / this.originalViewport.width) * rect.width)}px`;
                button.style.top = `${((item.ycoordinate / this.originalViewport.height) * rect.height)}px`;

                // Butonu ekranda uygun alana ekle
                this.canvasContainerRef.nativeElement.appendChild(button);

                // Butona tıklandığında pop-up açılacak
                button.addEventListener('click', () => {
                  // Modal mesajını güncelle
                  modalMessage.textContent = `Kişi:${item.user.firstName} Email:${item.user.email} Mesaj: ${item.note}\nKoordinatlar: X: ${item.xcoordinate}, Y: ${item.ycoordinate}`;

                  // Modal'ı göster
                  modal.style.display = 'block';
                });
              }
            });

            // Modal'ı kapatmak için close butonuna tıklama işlevi
            closeBtn.addEventListener('click', () => {
              modal.style.display = 'none';
            });

            // Modal dışına tıklanırsa, modal'ı kapat
            window.addEventListener('click', (event) => {
              if (event.target === modal) {
                modal.style.display = 'none';
              }
            });
          } else {
            console.error('Modal veya modalMessage elementi bulunamadı');
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
    console.log(JSON.parse(sessionStorage.getItem('user') || '{}').id)
    // Formdaki input değerini al


    // Gönderilecek JSON verisi
    const data = {
      // xcoordinate: this.pdfX,
      // ycoordinate: this.pdfY,
      // Kullanıcının girdiği metni al
      // pdfId: 123,
      xcoordinate: this.pdfX,
      ycoordinate: this.pdfY,
      pdfId: 1,
      title: this.title,
      note: this.metin,
      page: this.currentPageNumber,
      user: JSON.parse(sessionStorage.getItem('user') || '{}').id,
      pdfInfoEntity: this.pdfId
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
      this.updateParentMessage();
      console.log(`Tıklanan PDF Koordinatları X: ${this.pdfX.toFixed(2)}, Y: ${this.pdfY.toFixed(2)}`);

    }
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

  mousedown($event: MouseEvent) {
    const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
    this.startX = $event.clientX - rect.left;
    this.startY = $event.clientY - rect.top;
    this.isMouseDown = true;
  }

  mouseup($event: MouseEvent) {
    if (this.modeSelect == 1) {
      if (this.isMouseDown) {
        this.isMouseDown = false;

        const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
        const endX = $event.clientX - rect.left;
        const endY = $event.clientY - rect.top;

        console.log(`Başlangıç Koordinatları: X: ${this.startX.toFixed(2)}, Y: ${this.startY.toFixed(2)}`);
        console.log(`Bitiş Koordinatları: X: ${endX.toFixed(2)}, Y: ${endY.toFixed(2)}`);

        let astartX = this.startX.toFixed(2);
        let astartY = this.startY.toFixed(2);
        let aendX = endX.toFixed(2);
        let aendY = endY.toFixed(2);


        const highlightData = {
          startX: parseFloat(astartX),
          startY: parseFloat(astartY),
          endX: parseFloat(aendX),
          endY: parseFloat(aendY),
          pdfId: this.pdfId,
          userId: JSON.parse(sessionStorage.getItem('user') || '{}').id,
          currentPage: this.currentPageNumber
        }
        const user = JSON.parse(sessionStorage.getItem('user') || '{}').id
        console.log(user);

        fetch('http://localhost:8080/highlights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(highlightData)
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                throw new Error(JSON.stringify(errorData));
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('Başarıyla kaydedildi:', data);
          })
          .catch((error) => {
            console.error('Bir hata oluştu:', error);  // Detailed error message
          });


        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'position-absolute bg-warning';
        highlightDiv.id = 'higlighta';
        highlightDiv.style.opacity = '0.5';

        highlightDiv.style.left = Math.min(this.startX, endX) + 'px';
        highlightDiv.style.top = Math.min(this.startY, endY) + 'px';
        highlightDiv.style.width = Math.abs(endX - this.startX) + 'px';
        highlightDiv.style.height = Math.abs(endY - this.startY) + 'px';

        this.canvasContainerRef.nativeElement.appendChild(highlightDiv);
      }
    } else if (this.modeSelect == 2) {
      this.isDrawing = false;
    }
  }


  mouseDown($event: MouseEvent) {
    if (this.modeSelect == 1) {
      this.isMouseDown = true;
      const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
      this.startX = $event.clientX - rect.left;
      this.startY = $event.clientY - rect.top;
    } else if (this.modeSelect == 2) {
      this.isDrawing = true;
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.beginPath();
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.moveTo($event.offsetX, $event.offsetY);
    }
  }

  download($event: MouseEvent) {
    html2canvas(this.canvasContainerRef.nativeElement).then(canvas => {

      const link = document.createElement('a');
      html2canvas(this.canvasContainerRef.nativeElement, {
        scale: 2, // Daha yüksek çözünürlük için ölçek artırılır
        useCORS: true, // Cross-Origin Resource Sharing izinlerini etkinleştir
        logging: true, // Hata ayıklama için loglama
        allowTaint: true // Taint edilmiş (dış kaynaktan) içeriklere izin ver
      }).then(canvas => {
        // Oluşturulan canvas'ı indirmek için link oluştur
        const link = document.createElement('a');
        link.download = 'highlighted_pdf.png';
        link.href = canvas.toDataURL('image/png'); // PNG formatında çıktı
        link.click();
      }).catch(error => {
        console.error('PDF indirilirken bir hata oluştu:', error);
      });
    })
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
    if (this.isDrawing && this.modeSelect == 2) {
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.lineTo($event.offsetX, $event.offsetY);
      this.pdfCanvasRef?.nativeElement.getContext('2d')?.stroke();
    }
  }

  deleteAllNotes(): void {
    const deleteUrl = `http://localhost:8080/delAll/${this.pdfId}`;

    this.http.delete(deleteUrl, {responseType: 'text'}).subscribe({
      next: (response) => {
        console.log('Server response:', response); // "silindi" cevabı
        alert('All notes have been successfully deleted!'); // Kullanıcıya bilgi mesajı
        this.refreshPage(); // Sayfayı yenile
      },
      error: (error) => {
        console.error('Error occurred while deleting notes:', error);
        alert('An error occurred while deleting notes. Please try again.');
      },
    });
  }


  refreshPage() {
    window.location.reload(); // Sayfayı yenile
  }

}
