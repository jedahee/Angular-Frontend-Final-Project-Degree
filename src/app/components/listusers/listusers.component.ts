import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-listusers',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.scss']
})
export class ListusersComponent implements OnInit {
  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  
  public user: User = <User>{};
  public users: User[] = [];
  public usersFiltered: User[] = [];
  public isLogged: boolean = false;
  public token_user: string|null = "";
  public username_filter: string = "";

  constructor(private userserv: UserService, private rute: Router) { 
    this.token_user = localStorage.getItem('token_gestion_pistas');
    
    if (this.token_user != null) {
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

        if (this.user.rol_id != 1) 
          this.rute.navigate(["/courts"]);
        else {
          this.userserv.getUsers().subscribe(datos => {
            this.users = datos.users;
            this.usersFiltered = this.users;
          })
        }
      }, (error) => {
        
        this.errorMsgRef.nativeElement.innerHTML = error.error.status + ". Inicie sesión o registrate";
        localStorage.removeItem("token_gestion_pistas");

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.rute.navigate(['/courts']);
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
      });
    }
  }

  returnUserFilteredByName() {
    if (this.username_filter != "") {
      this.usersFiltered = this.users.filter(user => {
        return user.email.toLocaleLowerCase().indexOf(this.username_filter.toLocaleLowerCase()) != -1;
      });
      
    } else
      this.usersFiltered = this.users;
  }

  ngOnInit(): void {
  }

}
