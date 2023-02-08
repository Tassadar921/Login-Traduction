import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
  animations: [
    trigger('signIn', [
      state('true',
        style({ opacity: 1})
      ),
      state('false',
        style({ opacity: 0, display: 'none'}),
      ),
      transition('* => *', animate('250ms 250ms'))
    ]),
    trigger('signUp', [
      state('true',
        style({ opacity: 1})
      ),
      state('false',
        style({ opacity: 0, display: 'none'}),
      ),
      transition('* => *', animate('250ms 250ms'))
    ])
  ]
})
export class ConnectionPage implements OnInit {

  public displayedComponent: string = 'signIn';
  public signInAnimationState: string = 'true';
  public signUpAnimationState: string = 'false';
  public blockDisplaySignUpOnLoading: boolean = true;
  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}

  ngOnInit() {
    setTimeout(() => this.blockDisplaySignUpOnLoading = false, 500);
  }

  toggle() {
    this.signInAnimationState === 'true' ? this.signInAnimationState = 'false' : this.signInAnimationState = 'true';
    this.signUpAnimationState === 'true' ? this.signUpAnimationState = 'false' : this.signUpAnimationState = 'true';
    setTimeout(() =>
    {
      if (this.displayedComponent === 'signIn') {
        this.displayedComponent = 'signUp';
      } else {
        this.displayedComponent = 'signIn';
      }
    }, 250);
  }
}
