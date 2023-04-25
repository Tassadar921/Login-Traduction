import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LanguageService} from '../shared/services/language.service';
import {Router} from '@angular/router';
import {RequestService} from '../shared/services/request.service';
import {CookieService} from '../shared/services/cookie.service';

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
    public devicePlatformService: DevicePlatformService,
    public languageService: LanguageService,
    private requestService: RequestService,
    private cookieService: CookieService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const rtrn: Object = await this.requestService.checkSession(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
    if(Object(rtrn).status){
      await this.router.navigate(['/home']);
    }
    setTimeout((): boolean => this.blockDisplaySignUpOnLoading = false, 500);
  }

  loadComponent(component: string): void {
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
