import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CourtsComponent } from './components/courts/courts.component';
import { FgpassComponent } from './components/fgpass/fgpass.component';
import { RegisterComponent } from './components/register/register.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { UpdatepasswordComponent } from './components/updatepassword/updatepassword.component';
import { CourtcardComponent } from './components/courtcard/courtcard.component';
import { DetailsuserComponent } from './components/detailsuser/detailsuser.component';
import { DetailscourtComponent } from './components/detailscourt/detailscourt.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { CommentsComponent } from './components/comments/comments.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CourtsComponent,
    FgpassComponent,
    RegisterComponent,
    PagenotfoundComponent,
    UpdatepasswordComponent,
    CourtcardComponent,
    DetailsuserComponent,
    DetailscourtComponent,
    CommentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
