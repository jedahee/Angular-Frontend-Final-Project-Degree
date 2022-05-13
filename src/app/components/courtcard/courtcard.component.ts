import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { Court } from 'src/app/models/court';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courtcard',
  templateUrl: './courtcard.component.html',
  styleUrls: ['./courtcard.component.scss']
})
export class CourtcardComponent implements OnInit, AfterViewChecked {

  @Input() court: Court = <Court>{}; 
  @Input() rol_id: number = -1;

  constructor(private rute: Router, private userserv: UserService) {
  }

  ngOnInit(): void {   
  }

  ngAfterViewChecked(): void {
  }

}
