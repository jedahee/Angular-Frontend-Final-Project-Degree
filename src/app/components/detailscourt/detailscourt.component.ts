import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { Floor } from 'src/app/models/floor';
import { Sport } from 'src/app/models/sport';
import { Reserve } from 'src/app/models/reserve';
import { UserService } from 'src/app/services/user.service';
import { CourtService } from 'src/app/services/court.service';
import { FloorService } from 'src/app/services/floor.service';
import { SportService } from 'src/app/services/sport.service';
import { ReserveService } from 'src/app/services/reserve.service';

@Component({
  selector: 'app-detailscourt',
  templateUrl: './detailscourt.component.html',
  styleUrls: ['./detailscourt.component.scss']
})
export class DetailscourtComponent implements OnInit {

  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('successMsg') successMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('aside') aside: ElementRef = <ElementRef>{};
  @ViewChild('profileImg') profileImg: ElementRef = <ElementRef>{};

  public isLogged: boolean = false;
  public token_user: string|null = "";
  public bookings: Reserve[] = [];
  public emptyBookings: string = "";
  public user: User = <User>{};

  constructor(private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService, private courtserv: CourtService, private floorserv: FloorService, private sportserv: SportService, private reserveserv: ReserveService) { 
    this.token_user = localStorage.getItem('token_gestion_pistas');
    
    if (this.token_user != null) {
      
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;


        // PETICIÓN RESERVAS
        this.reserveserv.getReservesByUser(this.user.id).subscribe(datos => {
          if (datos.msg == null || datos.msg == undefined) {
            this.bookings = datos.bookings;
          } else {
            this.emptyBookings = datos.msg;
          }
        }, (error) => {
          this.errorMsgRef.nativeElement.innerHTML = "Error en mostrar las reservas";
    
          this.errorMsgRef.nativeElement.classList.add('popup-transition');
          setTimeout(() => {
            this.errorMsgRef.nativeElement.classList.remove('popup-transition');
          }, 3000);
        });

      }, (error) => {
        
        this.errorMsgRef.nativeElement.innerHTML = error.error.status + ". Inicie sesión de nuevo o continue como anónimo";
        localStorage.removeItem("token_gestion_pistas");

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
      });
    }
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.isLogged) {
      // Estableciendo imagen al usuario
      if (this.user.rutaImagen == null) {
        this.profileImg.nativeElement.style.backgroundImage = "url(../../../assets/img/DefaultUserImg.svg)";
      } else {
        this.profileImg.nativeElement.style.backgroundImage = "url(" + 'http://127.0.0.1:8000/images/user/' + this.user.rutaImagen.split('/')[3]  +")";
      }
    }
  }

  logout() {
    if (this.token_user != null) {
      this.userserv.logout(this.token_user).subscribe(datos => {
        localStorage.removeItem("token_gestion_pistas");
      }, (error) => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });
    }
  }

  showHideAside() {
    this.aside.nativeElement.classList.toggle('container-bookings-active');
  }

}
