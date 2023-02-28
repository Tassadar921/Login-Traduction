import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LanguageService} from '../shared/services/language.service';

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
  public signInAnimationState: string = 'false';
  public signUpAnimationState: string = 'true';
  public blockDisplaySignUpOnLoading: boolean = true;

  constructor(
    public devicePlatformService: DevicePlatformService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    setTimeout(() => this.blockDisplaySignUpOnLoading = false, 500);
  }

  loadComponent(component: string) {
    if(component === 'signUp'){
      this.signInAnimationState = 'false';
      this.signUpAnimationState = 'true';
    }else if(component === 'signIn'){
      this.signInAnimationState = 'true';
      this.signUpAnimationState = 'false';
    }
    setTimeout(() => this.displayedComponent = component, 500);
  }
}
