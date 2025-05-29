import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild, HostListener} from '@angular/core';
import {PDFDocumentProxy} from 'pdfjs-dist';
import html2canvas from 'html2canvas';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import jsPDF from "jspdf";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare const pdfjsLib: any;

interface NoteItem {
  id?: string;
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
  isShowingNote?: boolean;
  displayData?: string;
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
  public notesData: NoteItem[] = [];
  public noteToggleStates: { [noteId: string]: boolean } = {}; // Notların detay gösterim durumunu tutar

  private currentPdfDoc: PDFDocumentProxy | null = null; // Yüklenen PDF dokümanını saklar
  private resizeSubject = new Subject<void>();

  private modalElement: HTMLElement | null = null;
  private modalMessageElement: HTMLElement | null = null;
  private closeButtonElement: HTMLElement | null = null;

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
            this.currentPdfDoc = pdf; // PDF dokümanını sakla
            this.renderPage(this.currentPdfDoc, this.currentPageNumber); // 1. sayfayı render et
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

    this.resizeSubject.pipe(debounceTime(300)).subscribe(() => {
      if (this.currentPdfDoc) {
        this.clearButtons();
        this.renderPage(this.currentPdfDoc, this.currentPageNumber);
      }
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeSubject.next();
  }

  ngOnInit(): void {
    console.log(JSON.parse(sessionStorage.getItem('user') || '{}').id)
    console.log(JSON.parse(sessionStorage.getItem('user') || '{}').id)
    console.log(JSON.parse(sessionStorage.getItem('user') || '{}').id)
    // URL parametrelerini almak
    const homeworkIdFromUrl = this.route.snapshot.paramMap.get('homeworkId');
    const pdfIdFromUrl = this.route.snapshot.paramMap.get('pdfId');

    // Modal elementlerini al
    this.modalElement = document.getElementById('modal');
    this.modalMessageElement = document.getElementById('modalMessage');
    this.closeButtonElement = document.querySelector('.modal .close');

    // Kapatma butonuna event listener ekle
    if (this.closeButtonElement) {
      this.closeButtonElement.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Modal dışına tıklanınca kapatma
    if (this.modalElement) {
      this.modalElement.addEventListener('click', (event) => {
        if (event.target === this.modalElement) {
          this.closeModal();
        }
      });
    }

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
        this.currentPdfDoc = pdf; // PDF dokümanını sakla
        this.renderPage(this.currentPdfDoc, this.currentPageNumber); // 1. sayfayı render et
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

  openModal(message: string) {
    if (this.modalElement && this.modalMessageElement) {
      this.modalMessageElement.innerHTML = message; // innerHTML kullanarak HTML içeriği de ekleyebiliriz.
      this.modalElement.classList.add('show');
    }
  }

  closeModal() {
    if (this.modalElement) {
      this.modalElement.classList.remove('show');
    }
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
          // Modal'ı aç ve mesajı ayarla
          const message = `<b>Başlık:</b> ${data.title || 'Başlık Yok'}<br>
                           <b>Not:</b> ${data.note}<br>
                           <b>Kullanıcı:</b> ${data.user ? data.user.firstName : 'Bilinmiyor'}<br>
                           <b>Koordinatlar:</b> X: ${data.xcoordinate.toFixed(2)}, Y: ${data.ycoordinate.toFixed(2)}`;
          this.openModal(message);
        } else {
          console.error('Veri yapısı beklenenden farklı: ', data);
          this.openModal('Not detayı alınamadı.');
        }
      })
      .catch(error => {
        console.error('API isteği sırasında hata oluştu:', error);
        this.openModal('Not detayı alınırken bir hata oluştu.');
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

  async renderPage(pdf: PDFDocumentProxy, pageNumber: number) {
    if (!this.canvasContainerRef || !this.pdfCanvasRef) {
      console.warn("Canvas references not yet available.");
      return;
    }
    try {
      const page = await pdf.getPage(pageNumber);
      const containerWidth = this.canvasContainerRef.nativeElement.offsetWidth;
      const desiredViewport = page.getViewport({ scale: 1 }); // Ölçeklenmemiş viewport
      const scale = containerWidth / desiredViewport.width; // Container'a sığacak ölçeği hesapla

      const viewport = page.getViewport({scale: scale}); // Dinamik ölçekli viewport
      this.originalViewport = page.getViewport({scale: 1}); // Orijinal koordinatlar için
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
              button.id = 'notes'; // ID'yi koruyoruz, temizleme mekanizması için önemli olabilir

              // Butonu doğru koordinatlarda yerleştir
              button.style.left = `${((item.xcoordinate / this.originalViewport.width) * rect.width)}px`;
              button.style.top = `${((item.ycoordinate / this.originalViewport.height) * rect.height)}px`;

              // Buton metnini basitleştir: Sadece başlığı göster
              button.textContent = `Not: ${item.title || 'Başlıksız'}`;

              // Butonu ekranda uygun alana ekle
              this.canvasContainerRef.nativeElement.appendChild(button);

              // Butona tıklandığında merkezi handleButtonClick fonksiyonunu çağır
              button.addEventListener('click', () => {
                this.handleButtonClick(item);
              });
            }
          });

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

      // Mevcut notları ve butonları canvas üzerine çiz
      this.clearButtons(); // Yeniden çizerken eski butonları temizle (renderPage içinde çağrılıyorsa)
      this.notesData.forEach(note => {
        if (note.page === pageNumber) {
          // Notun konumunu ve boyutunu ayarla
          const buttonElement = this.renderer.createElement('button');
          this.renderer.setProperty(buttonElement, 'innerHTML', note.displayData || note.note); // displayData varsa onu, yoksa notu göster
          this.renderer.setStyle(buttonElement, 'position', 'absolute');
          this.renderer.setStyle(buttonElement, 'left', `${note.xcoordinate}px`);
          this.renderer.setStyle(buttonElement, 'top', `${note.ycoordinate}px`);
          this.renderer.addClass(buttonElement, 'btn'); // Bootstrap butonu için class
          this.renderer.addClass(buttonElement, 'btn-info'); // Renk
          this.renderer.listen(buttonElement, 'click', () => this.handleButtonClick(note));

          // Canvas container'a butonu ekle
          const canvasContainer = this.canvasContainerRef.nativeElement;
          this.renderer.appendChild(canvasContainer, buttonElement);
          this.showButtons.push(buttonElement); // Butonu listeye ekle (kaldırmak için)
        }
      });

    } catch (error) {
      console.error('Sayfa render edilirken bir hata oluştu:', error);
    }
  }

  pageChangeForvard() {
    if (this.currentPageNumber < this.topPagepdf) {
      this.currentPageNumber++;
      this.clearButtons();
      if (this.currentPdfDoc) {
        this.renderPage(this.currentPdfDoc, this.currentPageNumber);
      }
    }
  }

  pageChangeBackvard() {
    if (this.currentPageNumber > 1) {
      this.currentPageNumber--;
      this.clearButtons();
      if (this.currentPdfDoc) {
        this.renderPage(this.currentPdfDoc, this.currentPageNumber);
      }
    }
  }

  clearButtons() {
    this.showButtons.forEach(button => {
      this.renderer.removeChild(this.canvasContainerRef.nativeElement, button);
    });
    this.showButtons = [];
  }

  refreshPage() {
    this.clearButtons();
    if (this.currentPdfDoc) {
      this.renderPage(this.currentPdfDoc, this.currentPageNumber);
    }
  }

  onSubmit() {
    console.log("oray")
    console.log(JSON.parse(sessionStorage.getItem('user') || '{}').id)
    // Formdaki input değerini al

    // Mevcut kodu koruyarak, notları notesData dizisine ekleyelim
    const newNote: NoteItem = {
      id: `${this.title}_${Date.now()}`,
      note: this.metin,
      xcoordinate: this.pdfX,
      ycoordinate: this.pdfY,
      page: this.currentPageNumber,
      title: this.title,
      user: JSON.parse(sessionStorage.getItem('user') || '{}'), // Kullanıcı bilgisini session'dan al
      isShowingNote: false, // Başlangıçta notu göster
      displayData: this.metin // Başlangıçta not metnini göster
    };
    // this.notesData.push(newNote); // YENİ NOTUN HEMEN GÖSTERİLMEMESİ İÇİN BU SATIR YORUMA ALINDI/KALDIRILDI

    // Gönderilecek JSON verisi
    const data = {
      // xcoordinate: this.pdfX,
      // ycoordinate: this.pdfY,
      // Kullanıcının girdiği metni al
      // pdfId: 123,
      xcoordinate: this.pdfX,
      ycoordinate: this.pdfY,
      pdfId: Number(this.pdfId),
      title: this.title,
      note: this.metin,
      page: this.currentPageNumber,
      userId: JSON.parse(sessionStorage.getItem('user') || '{}').id,
      pdfInfoEntityId:Number( this.pdfId)
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
    this.refreshPage();
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
    this.generatePdfFromCanvas();
  }
  generatePdfFromCanvas(): void {
    const element = this.canvasContainerRef.nativeElement;

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Sayfa boyutu: A4 (210 x 297 mm)
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Canvas boyutlarını mm cinsine çevir
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210; // A4 genişliği
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('highlighted_pdf.pdf');
    }).catch(error => {
      console.error('PDF indirilirken bir hata oluştu:', error);
    });
  }

  downloadWithoutButton($event: MouseEvent) {
    this.toggleVisibility();
    this.generatePdfFromCanvas();
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

  deleteAllHiglights() {
    const deleteUrl = `http://localhost:8080/highlights/delAll/${this.pdfId}`;

    this.http.delete(deleteUrl, {responseType: 'text'}).subscribe({
      next: (response) => {
        console.log('Server response:', response); // "silindi" cevabı
        alert('All highlights have been successfully deleted!'); // Kullanıcıya bilgi mesajı
        this.refreshPage(); // Sayfayı yenile
      },
      error: (error) => {
        console.error('Error occurred while deleting highlights:', error);
        alert('An error occurred while deleting highlights. Please try again.');
      },
    });
  }

  createNoteButton(note: NoteItem, canvas: HTMLCanvasElement, scale: number) {
    const button = this.renderer.createElement('button');
    this.renderer.addClass(button, 'note-button'); // CSS sınıfı ekle
    this.renderer.setProperty(button, 'id', `note-${note.id}`); // ID ata
    this.renderer.setAttribute(button, 'title', note.title || 'Not'); // Başlık ekle

    // Buton metnini ayarla
    const buttonText = note.isShowingNote ? (note.displayData || 'Detayları Gizle') : (note.title || 'Not');
    this.renderer.setProperty(button, 'textContent', buttonText);

    // Buton konumunu ve boyutunu ayarla (ölçek dikkate alınarak)
    const buttonSize = 20 * scale; // Temel buton boyutu (örneğin 20px) ölçekle çarpılır
    const fontSize = 0.8 * scale; // Temel font boyutu (örneğin 0.8vw) ölçekle çarpılır, vw yerine em veya rem de düşünülebilir. Daha dinamik olması için 0.5vw gibi bir değer de ayarlanabilir.

    this.renderer.setStyle(button, 'position', 'absolute');
    this.renderer.setStyle(button, 'left', `${note.xcoordinate * scale}px`);
    this.renderer.setStyle(button, 'top', `${note.ycoordinate * scale}px`);
    this.renderer.setStyle(button, 'width', `${buttonSize}px`);
    this.renderer.setStyle(button, 'height', `${buttonSize}px`);
    // Font boyutunu göreceli yapalım. `vw` viewport genişliğine göre, `em` parent elementin font boyutuna göre ölçeklenir.
    // Burada basitlik adına viewport genişliğine göre bir ayarlama yapıyoruz.
    // Daha sofistike bir yaklaşım için container genişliğini baz alabilir veya em kullanabilirsiniz.
    this.renderer.setStyle(button, 'font-size', `${fontSize}vw`); // Göreceli font boyutu
    this.renderer.setStyle(button, 'border-radius', '50%'); // Butonu yuvarlak yap
    this.renderer.setStyle(button, 'background-color', 'rgba(255, 165, 0, 0.7)'); // Turuncu, yarı saydam arka plan
    this.renderer.setStyle(button, 'color', 'white');
    this.renderer.setStyle(button, 'border', '1px solid orange');
    this.renderer.setStyle(button, 'cursor', 'pointer');
    this.renderer.setStyle(button, 'z-index', '1000'); // Diğer elementlerin üzerinde olması için
    this.renderer.setStyle(button, 'padding', '0'); // İç boşluğu sıfırla
    this.renderer.setStyle(button, 'display', 'flex');
    this.renderer.setStyle(button, 'align-items', 'center');
    this.renderer.setStyle(button, 'justify-content', 'center');
    this.renderer.setStyle(button, 'overflow', 'hidden'); // Taşan metni gizle
    this.renderer.setStyle(button, 'text-overflow', 'ellipsis'); // Uzun metinler için ...
    this.renderer.setStyle(button, 'white-space', 'nowrap'); // Metnin alt satıra kaymasını engelle

    // Canvas container'a butonu ekle
    const canvasContainer = this.canvasContainerRef.nativeElement;
    this.renderer.appendChild(canvasContainer, button);
    this.showButtons.push(button); // Butonu listeye ekle (kaldırmak için)
  }
}
