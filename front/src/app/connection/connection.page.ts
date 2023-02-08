import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  animations: [
    trigger('switchComponent', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1}))
      ]),
      transition('* => void', [
        animate('500ms', style({ opacity: 0}))
      ]),
    ])
  ]
})
export class ConnectionPage implements OnInit {

  public hasAnAccount: boolean = true;
  public displayedComponent: string = 'signIn';
  public signIn: boolean = true;
  public signUp: boolean = false;
  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}

  ngOnInit() {}

  toggle() {
    if(this.displayedComponent === 'signIn') {
      this.displayedComponent = 'signUp';
    }else{
      this.displayedComponent = 'signIn';
    }
    if(this.signIn){
      this.signIn = false;
      setTimeout(() => {this.signUp = true}, 500);
    }else{
      this.signUp = false;
      setTimeout(() => {this.signIn = true}, 500);
    }
  }
}
