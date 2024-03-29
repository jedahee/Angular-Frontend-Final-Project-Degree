import { Component, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
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
  selector: 'app-courts',
  templateUrl: './courts.component.html',
  styleUrls: ['./courts.component.scss']
})
export class CourtsComponent implements AfterViewChecked  {

  @ViewChild('filter') filter: ElementRef = <ElementRef>{};
  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('profileImg') profileImg: ElementRef = <ElementRef>{};
  @ViewChild('price') price: ElementRef = <ElementRef>{};
  @ViewChild('horaInicio') horaInicio: ElementRef = <ElementRef>{};
  @ViewChild('horaFin') horaFin: ElementRef = <ElementRef>{};
  @ViewChild('aforo') aforo: ElementRef = <ElementRef>{};
  @ViewChild('aside') aside: ElementRef = <ElementRef>{};
  @ViewChild('window') window: ElementRef = <ElementRef>{};

  public courts: any[] = [];
  public courtsFiltered: any[] = [];
  public courtsFilteredByName: any[] = [];
  public floors: Floor[] = [];
  public sports: Sport[] = [];
  public bookings: Reserve[] = [];
  public emptyBookings: string = "";
  public maxPrice: number = 0;
  public user: User = <User>{};
  public court: any = {};
  public token_user: string|null = "";
  public isLogged: boolean = false;
  public error: any;
  public idCourtDelete: number = -1;
  

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
        
        this.courtserv.getCourts().subscribe(datos => {
          this.courts = datos.courts;
          this.courtsFiltered = datos.courts;
        });

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
      });
    }

    this.floorserv.getFloors().subscribe(datos => {
      this.floors = datos.floors;
    });

    this.sportserv.getSports().subscribe(datos => {
      this.sports = datos.sports;
    });

    this.courtserv.getCourts().subscribe(datos => {
      this.courts = datos.courts;
      this.courtsFiltered = datos.courts;
    });
  }

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

  disableInputs() {
    this.horaInicio.nativeElement.disabled = this.aforo.nativeElement.value != "";
    this.horaFin.nativeElement.disabled = this.aforo.nativeElement.value != "";
    this.aforo.nativeElement.disabled = this.horaInicio.nativeElement.value != "" || this.horaFin.nativeElement.value != "";
  }

  showHideWindow(e: number) {
    if (e == -1)
      this.window.nativeElement.classList.remove("confirm-window-active");
    else
      this.window.nativeElement.classList.add("confirm-window-active");
    
    this.idCourtDelete = e;
  }

  delCourt() {
    this.courtserv.delCourt(this.idCourtDelete).subscribe(datos => {
      this.window.nativeElement.classList.remove("confirm-window-active");
      this.courtsFiltered = this.courtsFiltered.filter(c => c.id != this.idCourtDelete);
    }, error => {
      this.window.nativeElement.classList.remove("confirm-window-active");
      if (error.error.msg != undefined)
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
      else
        this.errorMsgRef.nativeElement.innerHTML = "No se puede borrar la pista con comentarios asociados";
      
      this.errorMsgRef.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsgRef.nativeElement.classList.remove('popup-transition');
      }, 2500);
    });
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

    this.rute.navigate(["/"]);
  }

  showHideAside() {
    this.aside.nativeElement.classList.toggle('container-bookings-active');
  }

  refreshPrice() {
    this.price.nativeElement.innerHTML = this.court.precioPorHora + " <span>€</span>";
  }

  showFilter() {
    this.filter.nativeElement.classList.toggle('hidden');
    if (this.filter.nativeElement.classList.value == 'hidden') {
    }
  }

  returnCourtsFilteredByName() {
    if (this.court.nombre != "") {
      this.courtsFilteredByName = this.courts.filter(court => {
        return court.nombre.toLocaleLowerCase().indexOf(this.court.nombre.toLocaleLowerCase()) != -1;
      });
      
      this.courtsFiltered=this.courtsFilteredByName;
    } else
      this.courtsFiltered = this.courts;
  }
  
  returnCourtsFiltered() {
    this.courtsFiltered = [];

    Object.entries(this.court).forEach(([key, value]) => {
      if (!value) {
        delete this.court[key];        
      }
    });

    this.courts.forEach(court => {
      if (this.court.suelo_id == undefined || court.suelo_id == this.court.suelo_id)
        if (this.court.deporte_id == undefined || court.deporte_id == this.court.deporte_id)
          if (this.court.disponible == undefined || (court.disponible == this.court.disponible))
            if (this.court.campoAbierto == undefined || (court.campoAbierto == this.court.campoAbierto))
              if (this.court.iluminacion == undefined || (court.iluminacion == this.court.iluminacion))
                if ((court.aforo != null && this.court.aforo != undefined && this.court.aforo < court.aforo) || (this.court.aforo == undefined))
                  if (this.court.precioPorHora >= court.precioPorHora || this.court.precioPorHora == undefined)
                    if ((court.horaInicio != null && this.court.horaInicio != undefined && new Date('1/1/1990 ' + this.court.horaInicio) <= new Date('1/1/1990 ' + court.horaInicio)) || (this.court.horaInicio == undefined))
                      if ((court.horaFinalizacion != null && this.court.horaFinalizacion != undefined && new Date('1/1/1990 ' + this.court.horaFinalizacion) >= new Date('1/1/1990 ' + court.horaFinalizacion)) || (this.court.horaFinalizacion == undefined)) {
                        this.courtsFiltered.push(court);
                      }
    });

    this.disableInputs();
  }

  calculateMaxPrice() {
    this.courts.forEach(court => {
      if (court.precioPorHora > Number(this.maxPrice))
        this.maxPrice = court.precioPorHora;
    });

    return this.maxPrice;
  }

}
