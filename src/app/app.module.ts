import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http"; //import the HttpClientModule

import { DataService } from "./service/data-service.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import Material Module
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [MaterialModule, BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, BrowserAnimationsModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
