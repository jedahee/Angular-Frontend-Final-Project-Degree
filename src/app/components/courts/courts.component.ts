import { Component, ViewChild, AfterViewInit, ElementRef  } from '@angular/core';
import { Court } from 'src/app/models/court';
import { Floor } from 'src/app/models/floor';
import { Sport } from 'src/app/models/sport';
import { UserService } from 'src/app/services/user.service';
import { CourtService } from 'src/app/services/court.service';
import { FloorService } from 'src/app/services/floor.service';
import { SportService } from 'src/app/services/sport.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-courts',
  templateUrl: './courts.component.html',
  styleUrls: ['./courts.component.scss']
})
export class CourtsComponent implements AfterViewInit  {

  @ViewChild('filter') filter: ElementRef = <ElementRef>{};
  @ViewChild('errorMsg') errorMsgRef: ElementRef<any> = <ElementRef>{};
  @ViewChild('profileImg') imgUser: ElementRef<any> = <ElementRef>{};

  public courts: Court[] = [];
  public floors: Floor[] = [];
  public sports: Sport[] = [];
  public user: User = <User>{};
  public token_user: string|null = "";
  public floorSelected: number = -1;
  public sportSelected: number = -1;
  public isLogged: boolean = false;

  constructor(private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService, private courtserv: CourtService, private floorserv: FloorService, private sportserv: SportService) {

    this.token_user = localStorage.getItem('token_gestion_pistas');

    this.floorserv.getFloors().subscribe(datos => {
      this.floors = datos.floors;
    });

    this.sportserv.getSports().subscribe(datos => {
      this.sports = datos.sports;
    });

    this.courtserv.getCourts().subscribe(datos => {
      this.courts = datos.courts;
      console.log(this.courts);
    });
  }

  ngAfterViewInit (): void {
    if (this.token_user != null) {
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

      }, (error) => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });
    }

    // Estableciendo imagen al usuario
    if (this.user.rutaImagen == null) {
      this.imgUser.nativeElement.styles.backgroundImg = "url(../assets/DefaultUserImg.svg)";
    } else {
      this.imgUser.nativeElement.styles.backgroundImg = "url("+ this.user.rutaImagen +")";
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

    this.rute.navigate(["/"]);
  }

  showFilter() {
    this.filter.nativeElement.classList.toggle('hidden');
  }

}
