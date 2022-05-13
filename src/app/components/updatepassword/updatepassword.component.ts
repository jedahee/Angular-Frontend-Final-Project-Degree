import { Component, ViewChildren, AfterViewInit, QueryList, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements AfterViewInit, OnInit {
  @ViewChildren('input') inputRef: QueryList<any> = <any>{};
  @ViewChildren('errorMsg') errorMsgRef: QueryList<any> = <any>{};
  @ViewChildren('successMsg') successMsgRef: QueryList<any> = <any>{};

  public user: User = <User>{};
  public email: string = "";
  public token: string = "";

  constructor(private rute: Router, private userService: UserService, private actRoute: ActivatedRoute) { }

  activeAnimationInput() {
    this.inputRef.forEach(input => {
      if (input.nativeElement.value.length > 0)
        input.nativeElement.classList.add("active-input");
      else
        input.nativeElement.classList.remove("active-input");
    });
  }

  ngOnInit(): void {
    this.email = this.actRoute.snapshot.params["email"];
    this.token = this.actRoute.snapshot.params["token"];
  }

  ngAfterViewInit(): void {
    this.activeAnimationInput();
  }

  onSubmit(user: User): void {

    this.userService.updatePassword(this.email, this.token, user.password).subscribe(datos => {
      this.successMsgRef.forEach(successMsg => {
        successMsg.nativeElement.innerHTML = datos.msg;

        successMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          successMsg.nativeElement.classList.remove('popup-transition');
          this.rute.navigate(['/']);
        }, 1500);
        
      });
    }, (error) => {
      console.log(error);
      this.errorMsgRef.forEach(errorMsg => {
        errorMsg.nativeElement.innerHTML = "Error inesperado";

        errorMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          errorMsg.nativeElement.classList.remove('popup-transition');
        }, 2500);
        
      });
      
    });
  }

}
