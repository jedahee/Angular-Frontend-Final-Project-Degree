import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtsComponent } from './components/courts/courts.component';
import { FgpassComponent } from './components/fgpass/fgpass.component';
import { LoginComponent } from './components/login/login.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RegisterComponent } from './components/register/register.component';
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
    path: "register",
    component: RegisterComponent
  },
  {
    path: "forgot-password",
    component: FgpassComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "update-password/:email/:token",
    component: UpdatepasswordComponent
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
