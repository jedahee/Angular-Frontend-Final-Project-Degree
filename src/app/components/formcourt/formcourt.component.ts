import { Component, OnInit, ViewChildren, ViewChild, AfterViewChecked, ElementRef, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourtService } from 'src/app/services/court.service';
import { FloorService } from 'src/app/services/floor.service';
import { SportService } from 'src/app/services/sport.service';
import { UserService } from 'src/app/services/user.service';
import { Floor } from 'src/app/models/floor';
import { Sport } from 'src/app/models/sport';
import { Court } from 'src/app/models/court';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-formcourt',
  templateUrl: './formcourt.component.html',
  styleUrls: ['./formcourt.component.scss']
})
export class FormcourtComponent implements OnInit, AfterViewChecked {

  @ViewChildren('input') inputRef: QueryList<any> = <any>{};
  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('horaInicioRef') horaInicioRef: ElementRef = <ElementRef>{};
  @ViewChild('horaFinRef') horaFinRef: ElementRef = <ElementRef>{};
  @ViewChild('aforoRef') aforoRef: ElementRef = <ElementRef>{};

  public court: Court = <Court>{};
  public user: User = <User>{};
  public isLogged: boolean = false;
  public floors: Floor[] = [];
  public sports: Sport[] = [];
  public token_user: string|null = "";
  public idUrl: number = -1;
  public text: string = "";
  public available_schedule_min = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00 (00:00)"];
  public available_schedule_max = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00 (00:00)"];
  public havePicture: boolean = false;
  public filePath: string = "";
  public file: File = <File>{};


  constructor(private userserv: UserService, private floorserv: FloorService, private sportserv: SportService, private rute: Router, private actRoute: ActivatedRoute, private courtserv: CourtService) {
    this.token_user = localStorage.getItem('token_gestion_pistas');
    this.idUrl = this.actRoute.snapshot.params["id"];
  
    if (this.token_user != null) {
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

        if (this.user.rol_id != 1)
          this.rute.navigate(["/courts"]);
        

        this.floorserv.getFloors().subscribe(datos=> {
          this.floors = datos.floors;
        });

        this.sportserv.getSports().subscribe(datos=> {
          this.sports = datos.sports;
        });

        if (this.idUrl != -1) {
          this.courtserv.getCourt(this.idUrl).subscribe(datos => {
            this.court = datos.court;
            this.minValueSelect();
            this.maxValueSelect();
            this.havePicture = this.court.rutaImagen != 'public/images/court/default.svg';
            
            
            if (this.court.deporte_id == 5) {
              this.sports = this.sports.filter(s => {
                return s.id == 5;
              });
            } else {
              this.sports = this.sports.filter(s => {
                return s.id != 5;
              });
            }
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

  ngOnInit(): void {
    if (this.idUrl == -1) {
      this.text = "Añadir";
    } else {
      this.text = "Modificar";
    }
  }

  uploadPicture(event: any) {
    this.file = event.target.files[0];
    this.havePicture = true;
    if (this.file != undefined) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePath = reader.result as string;
      }
      
      reader.readAsDataURL(this.file);
    }
  }

  removeProfilePicture() {
    this.court.rutaImagen = "public/images/court/default.svg";
    this.filePath = "";
    this.courtserv.delImg(this.court.id).subscribe(datos => {
      this.havePicture = false;
    }, error=> {
      this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

      this.errorMsgRef.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsgRef.nativeElement.classList.remove('popup-transition');
      }, 3000);
    });
  }

  minValueSelect() {
    this.available_schedule_min = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00 (00:00)"];
  
    this.available_schedule_min = this.available_schedule_min.filter(h => {
      return Number(h.substring(0, 2)) < Number(this.court.horaFinalizacion?.substring(0, 2));
    });
  }

  maxValueSelect() {
    this.available_schedule_max = ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00 (00:00)"];
  
    this.available_schedule_max = this.available_schedule_max.filter(h => {
      return Number(h.substring(0, 2)) > Number(this.court.horaInicio?.substring(0, 2));
    });
  }
  

  activeAnimationInput() {
    this.inputRef.forEach(input => {
      if (input.nativeElement.value.length > 0)
        input.nativeElement.classList.add("active-input");
      else
        input.nativeElement.classList.remove("active-input");
    });
  }

  ngAfterViewChecked(): void {
    this.activeAnimationInput();
  }

  onSubmit(court: Court): void {
    if (this.idUrl != -1) {
      // Asignando null
      if (this.court.deporte_id == 5) {
        court.horaInicio = this.court.horaInicio;
        court.horaFinalizacion = this.court.horaFinalizacion;
      } else if (this.court.deporte_id != 5) {
        court.aforo = this.court.aforo;
      }

      this.courtserv.updateCourt(court, this.idUrl).subscribe(datos => {
        if (this.filePath != '') {
          this.courtserv.addImg(this.idUrl, this.file).subscribe(datos => {
            this.rute.navigate(['/courts']);
          }, error => {
            if (error.error.msg != undefined)
              this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
            else
              this.errorMsgRef.nativeElement.innerHTML = 'Esta imagen no es válida (comprueba que las dimensiones o el peso de la imagen no sea muy grande)';

            this.errorMsgRef.nativeElement.classList.add('popup-transition');
            setTimeout(() => {
              this.errorMsgRef.nativeElement.classList.remove('popup-transition');
            }, 3000);
          });
        } else {
          this.rute.navigate(['/courts']);
        }
        
      }, error => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
        localStorage.removeItem("token_gestion_pistas");

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 3000);
      });
    } else {
      if (court.deporte_id == 5) {
        court.horaInicio = null;
        court.horaFinalizacion = null;
      } else if (court.deporte_id != 5) {
        court.aforo = null;
      }

      if (court.disponible == undefined)
        court.disponible = false;
      if (court.campoAbierto == undefined)
        court.campoAbierto = false;
      if (court.iluminacion == undefined)
        court.iluminacion = false;

      console.log(court);
      this.courtserv.addCourt(court).subscribe(datos => {
        this.rute.navigate(['/courts']);
         
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
