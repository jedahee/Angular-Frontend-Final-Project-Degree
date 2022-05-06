import { Component, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  @ViewChildren('input') inputRef: QueryList<any> = <any>{};

  // Hacer interfaz del usuario
  // Crear objeto usuario para ngmodel del html
  // Crear onsubmit
  // Crear servicios

  public user: User = <User>{};

  constructor() {
  }

  activeAnimationInput() {
    this.inputRef.forEach(input => {
      if (input.nativeElement.value.length > 0)
        input.nativeElement.classList.add("active-input");
      else
        input.nativeElement.classList.remove("active-input");
    });
  }

  ngAfterViewInit(): void {
    this.activeAnimationInput();
  }

}
