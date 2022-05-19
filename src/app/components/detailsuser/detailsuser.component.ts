import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-detailsuser',
  templateUrl: './detailsuser.component.html',
  styleUrls: ['./detailsuser.component.scss']
})
export class DetailsuserComponent implements OnInit {

  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('successMsg') successMsgRef: ElementRef = <ElementRef>{};
  @ViewChild('errorMsg') errorMsg: ElementRef = <ElementRef>{};
  @ViewChild('window') window: ElementRef = <ElementRef>{};

  public token_user: string|null = "";
  public isLogged: boolean = false;
  public error: any;
  public user: User = <User>{};
  public adv1: string = "";
  public adv2: string = "";
  public role: string = "";
  public idUrl: number = -1;
  public isReadOnly: boolean = true;
  public havePicture: boolean = false;
  public filePath: string = "";
  public file: File = <File>{};

  constructor(private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService) {

    this.token_user = localStorage.getItem('token_gestion_pistas');
    this.idUrl = actRoute.snapshot.params["id"];
    
    if (this.token_user != null) {
      this.userserv.getUser(this.token_user).subscribe(datos => {
        this.isLogged = true;
        this.user = datos.user;

        this.havePicture = this.user.rutaImagen != null;
        
      }, (error) => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.status + ". Inicie sesión de nuevo o continue como anónimo";
        localStorage.removeItem("token_gestion_pistas");

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
          this.rute.navigate(["/courts"]);
        }, 3000);
        
      });

      // OBTENIENDO ADVERTENCIAS
      this.userserv.getWarnings().subscribe(datos => {
        this.adv1 = datos.adv1;
        this.adv2 = datos.adv2;
      });

      // OBTENIENDO ROL
      this.userserv.getRole().subscribe(datos => {
        switch (datos.rol_id) {
          case 1:
            this.role = 'Admin';
            break;
          case 2:
            this.role = 'Mod';
            break;
          case 3:
            this.role = 'Usuario';
            break;
          default:
            this.role = 'Sin estado';
        }
      });
    } else {
      this.rute.navigate(["/courts"]);
    }
  }

  ngOnInit(): void {
  }

  logout() {
    if (this.token_user != null) {
      this.userserv.logout(this.token_user).subscribe(datos => {
        localStorage.removeItem("token_gestion_pistas");
        this.rute.navigate(["/courts"]);
      }, (error) => {
        this.errorMsgRef.nativeElement.innerHTML = error.error.msg;

        this.errorMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });
    }
  }

  showHideWindow() {
    this.window.nativeElement.classList.toggle("confirm-window-active");
  }

  delAccount() {
    if (this.token_user != null) {
      this.userserv.deleteAccount().subscribe(datos => {
        localStorage.removeItem("token_gestion_pistas");
        this.successMsgRef.nativeElement.innerHTML = datos.msg;

        this.successMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.successMsgRef.nativeElement.classList.remove('popup-transition');
          this.rute.navigate(['/courts']);
        }, 1500);
      });
    }
  }

  changeReadOnlyValue(value: boolean) {
    this.isReadOnly = value;
  }

  uploadPicture(event: any) {
    this.file = event.target.files[0];
    
    if (this.file != undefined) {
      const reader = new FileReader();
      reader.onload = () => {
        this.filePath = reader.result as string;
      }
      
      reader.readAsDataURL(this.file);
      
    }
  }

  removeProfilePicture() {
    this.user.rutaImagen = null;
    this.userserv.deleteImg().subscribe(datos => {
      this.havePicture = false;
    }, error=> {
      this.errorMsg.nativeElement.innerHTML = error.error.msg;

      this.errorMsg.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsg.nativeElement.classList.remove('popup-transition');
      }, 3000);
    });
  }

  updateRole(rol_id: number) {
    let id_user = this.actRoute.snapshot.params["id"];

    this.userserv.updateRole(id_user, rol_id).subscribe(datos => {
      this.successMsgRef.nativeElement.innerHTML = datos.msg;

        this.successMsgRef.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.successMsgRef.nativeElement.classList.remove('popup-transition');
        }, 2500);
    }, error => {
      this.errorMsg.nativeElement.innerHTML = error.error.msg;

      this.errorMsg.nativeElement.classList.add('popup-transition');
      setTimeout(() => {
        this.errorMsg.nativeElement.classList.remove('popup-transition');
      }, 2500);
    });
  }

  onSubmit(user: User): void {
    if (this.token_user != null) {
      
      this.userserv.editEmail(user.email).subscribe(datos => {}, (error) => {

        this.errorMsg.nativeElement.innerHTML = error.error.msg;

        this.errorMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsg.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });

      this.userserv.editUsername(user.nombre, user.apellidos).subscribe(datos => {}, (error) => {

        this.errorMsg.nativeElement.innerHTML = error.error.msg;

        this.errorMsg.nativeElement.classList.add('popup-transition');
        setTimeout(() => {
          this.errorMsg.nativeElement.classList.remove('popup-transition');
        }, 2500);
      });

      if (user.foto_perfil != undefined && user.foto_perfil != null) {
        
        this.userserv.updateImg(this.file).subscribe(datos => {
          this.havePicture = true; 
        }, 
          (error) => {
          this.errorMsg.nativeElement.innerHTML = 'Esta imagen no es válida (comprueba que las dimensiones o el peso de la imagen no sea muy grande)';

          this.errorMsg.nativeElement.classList.add('popup-transition');
          setTimeout(() => {
            this.errorMsg.nativeElement.classList.remove('popup-transition');
          }, 3000);
        });
      }

    }
  }


}
