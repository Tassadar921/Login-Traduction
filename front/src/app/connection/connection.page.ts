import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  animations: [
    trigger('switchComponent', [
      transition('signIn => *, signUp => *', [
        style({ opacity: 0}),
        animate('250ms 250ms', style({ opacity: 1}))
      ]),
      transition('* => signIn, * => signUp', [
        animate('250ms', style({ opacity: 0}))
      ]),
    ])
  ]
})
export class ConnectionPage implements OnInit {

  public displayedComponent: string = 'signIn';
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
  }
}
