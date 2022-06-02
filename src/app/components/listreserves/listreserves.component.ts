import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ReserveService } from 'src/app/services/reserve.service';
import { CourtService } from 'src/app/services/court.service';
import { User } from 'src/app/models/user';
import { Reserve } from 'src/app/models/reserve';

@Component({
  selector: 'app-listreserves',
  templateUrl: './listreserves.component.html',
  styleUrls: ['./listreserves.component.scss']
})
export class ListreservesComponent implements OnInit {

  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};

  public user: User = <User>{};
  public reserves: Reserve[] = [];
  public reservesFiltered: Reserve[] = [];
  public isLogged: boolean = false;
  public token_user: string|null = "";
  public date_selected: string = "";

  constructor(private courtserv: CourtService, private userserv: UserService, private reserveserv: ReserveService, private rute: Router) {
    this.token_user = localStorage.getItem('token_gestion_pistas');

    if (this.token_user != null) {
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

        if (this.user.rol_id != 1) {
          this.rute.navigate(["/courts"]);
        } else {
          this.reserveserv.getReserves().subscribe(datos => {
            this.reserves = datos.bookings;
            this.reservesFiltered = this.reserves;

            this.reserves.forEach(b => {
              this.courtserv.getCourt(b.pistas_id).subscribe(datos=> {
                b.nombre_pista = datos.court.nombre;
              });

              this.userserv.getUserById(b.users_id).subscribe(datos=> {
                b.nombre_usuario = datos.user.email;
              });
            });

          });
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

  delReserve(id: number) {
    this.reserveserv.delReserve(id).subscribe(datos=>{
      this.reserves = this.reserves.filter(b => b.id != id);
      this.reservesFiltered = this.reserves;
    }, error => {
      this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.rute.navigate(['/courts']);
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
    })
  }

  filterByDate() {
    if (this.date_selected != "") {
      this.reservesFiltered = this.reserves.filter(b => new Date(b.fechaCita) > new Date(this.date_selected));
    } else {
      this.reservesFiltered = this.reserves;
    }
  }

  ngOnInit(): void {

  }

}
