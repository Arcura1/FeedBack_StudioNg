import { HttpClientModule } from '@angular/common/http';
import {NgModule} from "@angular/core";
import {AppComponent} from "../app.component";

@NgModule({
  declarations: [
    // bileşenlerin
  ],
  imports: [
    // diğer modüller
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
