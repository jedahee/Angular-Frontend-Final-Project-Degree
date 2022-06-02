import { Component, ViewChild, ViewChildren, OnInit, ElementRef, AfterViewInit, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import { Reserve } from 'src/app/models/reserve';
import { UserService } from 'src/app/services/user.service';
import { CourtService } from 'src/app/services/court.service';
import { FloorService } from 'src/app/services/floor.service';
import { SportService } from 'src/app/services/sport.service';
import { ReserveService } from 'src/app/services/reserve.service';
import { CommentService } from 'src/app/services/comment.service';
@Component({
  selector: 'app-detailscourt',
  templateUrl: './detailscourt.component.html',
  styleUrls: ['./detailscourt.component.scss']
})
export class DetailscourtComponent implements OnInit, AfterViewInit {

  @ViewChildren('input') inputRef: QueryList<any> = <any>{};
  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('successMsg') successMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('profileImg') profileImg: ElementRef = <ElementRef>{};
  @ViewChild('windowAddWarning') windowAddWarning: ElementRef = <ElementRef>{};
  @ViewChild('svgLike') svgLike: ElementRef = <ElementRef>{};

  public isLogged: boolean = false;
  public token_user: string|null = "";
  public bookings: Reserve[] = [];
  public existsBookings: Reserve[] = [];
  public emptyBookings: string = "";
  public emptyComments: string = "";
  public comments: Comment[] = [];
  public commentEvent: Comment = <Comment>{};
  public user: User = <User>{};
  public court: any = {};
  public idUrl: number = -1;
  public floor_name: string = "";
  public sport_name: string = "";
  public total_likes: number = 0;
  public total_dislikes: number = 0;
  public warning_text: string = "";
  public commentToAdd = {
    text: "",
    like: true
  };

  constructor(private commentserv: CommentService, private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService, private courtserv: CourtService, private floorserv: FloorService, private sportserv: SportService, private reserveserv: ReserveService) { 

    this.token_user = localStorage.getItem('token_gestion_pistas');
    this.idUrl = this.actRoute.snapshot.params["id"];

    if (this.token_user != null) {
      
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

        // Comprueba si existe una reserva con esta pista y este usuario
        this.reserveserv.existsReserve(this.user.id, this.idUrl).subscribe(datos => {
          this.existsBookings = datos.booking;
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

    this.commentserv.getComments(this.idUrl).subscribe(datos => {
      if (datos.comments.length == 0) {
        this.emptyComments = datos.msg;
      } else {
        this.comments = datos.comments;

        this.comments.forEach(comment => {
          if (comment.like)
            this.total_likes++;
          else
            this.total_dislikes++;
        });
      }
    });

  }

  ngOnInit(): void {
    this.courtserv.getCourt(this.idUrl).subscribe(datos => {
      this.court = datos.court;

      // Obtener suelo
      this.floorserv.getFloor(this.court.suelo_id).subscribe(datos => {
        this.floor_name = datos.floor.nombre;
      });

      // Obtener deporte
      this.sportserv.getSport(this.court.deporte_id).subscribe(datos => {
        this.sport_name = datos.sport.nombre;
      });

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

  ngAfterViewInit(): void {
    this.activeAnimationInput();
  }

  activeAnimationInput() {
    this.inputRef.forEach(input => {
      if (input.nativeElement.value.length > 0)
        input.nativeElement.classList.add("active-input");
      else
        input.nativeElement.classList.remove("active-input");
    });
  }

  openWindowAddWarning(commentEvent: Comment) {
    this.commentEvent = commentEvent;
    this.windowAddWarning.nativeElement.classList.add('window-add-warning-active');
  }

  exitWindowAddWarning() {
    this.windowAddWarning.nativeElement.classList.remove('window-add-warning-active');
  }

  addWarning() {
    if (this.warning_text != "") {
      this.userserv.addWarning(this.warning_text, this.commentEvent.users_id).subscribe(datos => {
        this.successMsgRef.nativeElement.innerHTML = datos.msg;
        
        this.successMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.successMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2000);
        
        // PETICIÓN BORRAR COMENTARIO
        this.commentserv.delComment(this.commentEvent.id).subscribe(datos => {
          this.delCommentFromArray(this.commentEvent);
        }, error => {
          this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
    
          this.errorMsgRef.nativeElement.classList.add('popup-transition');
          setTimeout(() => {
            this.errorMsgRef.nativeElement.classList.remove('popup-transition');
          }, 3000);
        });

        this.warning_text = "";
        this.exitWindowAddWarning();

      }, error => {
        if (error.status == 400) 
          this.errorMsgRef.nativeElement.innerHTML = 'Los carácteres mínimos son 5';
        else if (error.status == 403) {
          this.errorMsgRef.nativeElement.innerHTML = 'Esta cuenta ya está bloqueada';
          
          // PETICIÓN BORRAR COMENTARIO
          this.commentserv.delComment(this.commentEvent.id).subscribe(datos => {
            this.delCommentFromArray(this.commentEvent);
            this.exitWindowAddWarning();
          }, error => {
            this.errorMsgRef.nativeElement.innerHTML = error.error.msg;
      
            this.errorMsgRef.nativeElement.classList.add('popup-transition');
            setTimeout(() => {
              this.errorMsgRef.nativeElement.classList.remove('popup-transition');
            }, 3000);
          });
        }
          this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2000);
      });
    } else {
      this.errorMsgRef.nativeElement.innerHTML = 'El campo de texto no puede estar vacio';

      this.errorMsgRef.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsgRef.nativeElement.classList.remove('popup-transition');
      }, 2000);
      this.exitWindowAddWarning();
      this.warning_text = "";
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
    } else {
      this.rute.navigate(["/courts"]);
    }
  }

  delReserve(id: number) {
    if (this.token_user != null) {
      
      this.reserveserv.delReserve(id).subscribe(datos => {
        this.successMsgRef.nativeElement.innerHTML = datos.msg;
        this.existsBookings = this.existsBookings.filter(b => b.id != id);
        
        this.successMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.successMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);

      }, (error) => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });
      
    }
  }
  
  delCommentFromArray(commentEvent: Comment) {
    this.total_likes = 0;
    this.total_dislikes = 0;

    this.comments = this.comments.filter(comment => {
      
      if(comment.id != commentEvent.id) {
        if (comment.like)
          this.total_likes++;
        else
          this.total_dislikes++;
      }

      return comment.id != commentEvent.id;
      
    });

    if (this.comments.length == 0)
      this.emptyComments = "No hay comentarios de esta pista";
    
  }
  
  addComment() {
    this.commentserv.addComment(this.idUrl, this.commentToAdd).subscribe(datos=>{
      this.comments.push(datos.comment);
      this.total_likes = 0;
      this.total_dislikes = 0;
      this.commentToAdd.text = "";

      this.comments.forEach(comment => {
        if (comment.like)
          this.total_likes++;
        else
          this.total_dislikes++;
      });

      if (this.comments.length != 0)
        this.emptyComments = "";
      
    }, error => {
      this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

      this.errorMsgRef.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsgRef.nativeElement.classList.remove('popup-transition');
      }, 2500);
    });
  }

  likeOrDislike() {
    this.commentToAdd.like = !this.commentToAdd.like;
    
    if (this.commentToAdd.like) {
      this.svgLike.nativeElement.classList.remove('dislike');
    } else {
      this.svgLike.nativeElement.classList.add('dislike');
    }
  }

}
