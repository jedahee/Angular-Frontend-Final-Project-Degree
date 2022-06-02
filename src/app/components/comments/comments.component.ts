import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() comment: Comment = <Comment>{}; 
  @Input() user: User = <User>{}; 

  @Output() onDelete = new EventEmitter<Comment>();
  @Output() openWindow = new EventEmitter<Comment>();

  @ViewChild('errorMsg') errorMsgRef: ElementRef = <ElementRef>{};

  public token_user: string|null = "";
  public user_comment: User = <User>{};

  constructor(private commentserv: CommentService, private actRoute: ActivatedRoute, private rute: Router, private userserv: UserService) {
    this.token_user = localStorage.getItem('token_gestion_pistas');
    
  }

  ngOnInit(): void {
    this.userserv.getUserById(this.comment.users_id).subscribe(datos => {
      this.user_comment = datos.user;
    });
  }

  openWindowAddWarning(comment: Comment) {
    if (this.user.id != this.user_comment.id && (this.user.rol_id == 1 || this.user.rol_id == 2)) {
      this.openWindow.emit(comment); 
    } else if (this.user.id == this.user_comment.id) {
      this.commentserv.delComment(comment.id).subscribe(datos => {
        this.onDelete.emit(comment);
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
