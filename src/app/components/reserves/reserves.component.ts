import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { Court } from 'src/app/models/court';
import { Reserve } from 'src/app/models/reserve';
import { UserService } from 'src/app/services/user.service';
import { CourtService } from 'src/app/services/court.service';
import { ReserveService } from 'src/app/services/reserve.service';

@Component({
  selector: 'app-reserves',
  templateUrl: './reserves.component.html',
  styleUrls: ['./reserves.component.scss']
})
export class ReservesComponent implements OnInit, AfterViewInit {

  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('successMsg') successMsgRef: ElementRef = <ElementRef>{};
  
  public idUrl: number = -1;
  public token_user: string|null = "";
  public reservesCourt: Reserve[] = [];
  public isLogged: boolean = false;
  public user: User = <User>{};
  public court: Court = <Court>{};
  public isCapacity: boolean = false;
  public calendar_court: any[] = [];
  public schedule_array: number[] = [];
  public end_hour: number = -1;
  public year: number = -1;
  public today: Date = new Date();
  public date_selected: Date = new Date();
  public numReservesWithCapacity: number = 0;
  public numYourBooking: number = 1;
  public rememberBookingNumber: number = -1;
  public haveReserve: boolean = false;
  public schedule_selected: number = -1;

  constructor(private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService, private courtserv: CourtService, private reserveserv: ReserveService) { 
    this.token_user = localStorage.getItem('token_gestion_pistas');
    this.idUrl = this.actRoute.snapshot.params["court_id"];
    this.year = new Date().getFullYear();
    if (this.token_user != null) {
      
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

      }, (error) => {
        
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg + ". Inicie sesión o registrate";
        localStorage.removeItem("token_gestion_pistas");

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.rute.navigate(['/courts']);
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
      });

      this.courtserv.getCourt(this.idUrl).subscribe(datos => {
        if (datos.court.deporte_id == 5)
          this.isCapacity = true;
        else
          this.isCapacity = false;

        this.court = datos.court;

        this.reserveserv.getReservesByCourt(this.idUrl).subscribe(datos => {
          this.reservesCourt = datos.bookings;
          
        });
      });

    } else {
      this.rute.navigate(['/courts']);
    }
  }

  updateHoursAvailable() {
    this.calendar_court = [];
    this.schedule_selected = -1;

    if (this.court.horaInicio != null && this.court.horaFinalizacion != null) {
      for (let x = Number(this.court.horaInicio.substring(0, 2)); x < Number(this.court.horaFinalizacion.substring(0, 2)); x++) {
        this.calendar_court.push(x);
      }

      this.reservesCourt.forEach(booking => {
        if (booking.numLista == null) {
          if (this.date_selected == booking.fechaCita && booking.horaInicio != null) {
            this.calendar_court = this.calendar_court.filter(h => h != Number(booking.horaInicio?.substring(0, 2)));
          }
        }
      });
    }
  }

  updateCapacityAvailable() {
    this.numYourBooking = 1;
    this.numReservesWithCapacity = 0;
    this.haveReserve = false;

    this.reservesCourt.forEach(booking => {
      
      if (booking.horaInicio == null && booking.numLista != null) {
        let fechaCita = new Date(booking.fechaCita);
        fechaCita = new Date(fechaCita.getFullYear() + "-" + (fechaCita.getMonth()+1) + "-" + fechaCita.getDate());
        
        let date_selected_obj = new Date(new Date(this.date_selected).getFullYear() + "-" + (new Date(this.date_selected).getMonth()+1) + "-" + new Date(this.date_selected).getDate());
        
        if (date_selected_obj.getTime() == fechaCita.getTime()) {
          this.numReservesWithCapacity++;
          
          if (booking.users_id == this.user.id) {
            this.haveReserve = true;
            this.rememberBookingNumber = booking.numLista;
          }

          if (booking.numLista != null && booking.numLista == this.numYourBooking)
            this.numYourBooking++;
        }
      }
    });
  }

  addReserve() {
    if (this.court.deporte_id == 5) {
      let data = {
        horaFinalizacion: null,
        horaInicio: null,
        fechaCita: this.date_selected,
        numLista: this.numYourBooking,
        users_id: this.user.id,
        pistas_id: this.idUrl,
      }

      this.reserveserv.addReserve(data).subscribe(datos => {
        this.successMsgRef.nativeElement.innerHTML = datos.msg;

        this.successMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.successMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);

        this.haveReserve = true;
        this.rememberBookingNumber = this.numYourBooking;
        this.numReservesWithCapacity++;
        
      }, error => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);

      });
    } else {
      if (typeof this.schedule_selected == "number" && this.schedule_selected != -1) {
        let data = {
          horaFinalizacion: (this.schedule_selected+1) + ":00",
          horaInicio: this.schedule_selected + ":00",
          fechaCita: this.date_selected,
          numLista: null,
          users_id: this.user.id,
          pistas_id: this.idUrl,
        }
         

        this.reserveserv.addReserve(data).subscribe(datos => {
          this.calendar_court = this.calendar_court.filter(h => h != this.schedule_selected);
          
          this.reserveserv.getReservesByCourt(this.idUrl).subscribe(datos => {
            this.reservesCourt = datos.bookings;
          });
          
        }, error => {
          this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
  
          this.errorMsgRef.nativeElement.classList.add('popup-transition');
          setTimeout(() => {
            this.errorMsgRef.nativeElement.classList.remove('popup-transition');
          }, 3000);
  
        });
      }
    }
    
    
  }

  select_schedule(hour: number) {
    this.schedule_selected = hour;
  }

  addCss(hour: number) {
    return {'disabled-schedule': hour != this.schedule_selected && this.schedule_selected != -1};
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    
  }

}
