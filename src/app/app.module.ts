import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PlannerApiService} from './shared/services/PlannerApiService';
import {DashboardComponent} from './pages/components/dashboard/dashboard.component';
import {HttpClientModule} from '@angular/common/http';
import {LuxonModule} from 'luxon-angular';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LuxonModule,
    FormsModule,
  ],
  providers: [
    PlannerApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
