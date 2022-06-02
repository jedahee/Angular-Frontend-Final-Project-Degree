import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtsComponent } from './components/courts/courts.component';
import { DetailscourtComponent } from './components/detailscourt/detailscourt.component';
import { DetailsuserComponent } from './components/detailsuser/detailsuser.component';
import { FgpassComponent } from './components/fgpass/fgpass.component';
import { FormcourtComponent } from './components/formcourt/formcourt.component';
import { ListreservesComponent } from './components/listreserves/listreserves.component';
import { ListusersComponent } from './components/listusers/listusers.component';
import { LoginComponent } from './components/login/login.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservesComponent } from './components/reserves/reserves.component';
import { UpdatepasswordComponent } from './components/updatepassword/updatepassword.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "courts",
    component: CourtsComponent
  },
  {
    path: "details-user/:id",
    component: DetailsuserComponent
  },
  {
    path: "details-court/:id",
    component: DetailscourtComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "forgot-password",
    component: FgpassComponent
  },
  {
    path: "update-password/:email/:token",
    component: UpdatepasswordComponent
  },
  {
    path: "reserve/:court_id",
    component: ReservesComponent
  },
  {
    path: "form-court/:id",
    component: FormcourtComponent
  },
  {
    path: "list-users",
    component: ListusersComponent
  },
  {
    path: "list-reserves",
    component: ListreservesComponent
  },
  { 
    path: '**', 
    pathMatch: 'full', 
    component: PagenotfoundComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
