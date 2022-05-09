import { Component, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fgpass',
  templateUrl: './fgpass.component.html',
  styleUrls: ['./fgpass.component.scss']
})
export class FgpassComponent implements AfterViewInit {
  @ViewChildren('input') inputRef: QueryList<any> = <any>{};
  @ViewChildren('errorMsg') errorMsgRef: QueryList<any> = <any>{};
  @ViewChildren('successMsg') successMsgRef: QueryList<any> = <any>{};

  public user: User = <User>{};

  constructor(private rute: Router, private userService: UserService) { }

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

  onSubmit(user: User): void {
    this.userService.forgotPassword(user.email).subscribe(datos => {
      this.successMsgRef.forEach(successMsg => {
        successMsg.nativeElement.innerHTML = "Reseteo de contraseña enviado a: <strong>"+user.email+"</strong>";

        successMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          successMsg.nativeElement.classList.remove('popup-transition');
        }, 2500);
        
      });
    }, (error) => {
      this.errorMsgRef.forEach(errorMsg => {
        errorMsg.nativeElement.innerHTML = error.error.msg;

        errorMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          errorMsg.nativeElement.classList.remove('popup-transition');
        }, 2500);
        
      });
      
    });
  }

}
