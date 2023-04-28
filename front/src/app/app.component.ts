import {Component, OnInit} from '@angular/core';
import {LanguageService} from './shared/services/language.service';
import {DevicePlatformService} from './shared/services/device-platform.service';
import {CryptoService} from "./shared/services/crypto.service";
import {CookieService} from './shared/services/cookie.service';
import {RequestService} from './shared/services/request.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private cryptoService: CryptoService,
    private cookieService: CookieService,
    private requestService: RequestService
  ) {}

  async ngOnInit(): Promise<void>  {
    await this.languageService.init();
    if(await this.cookieService.getCookie('sessionToken')) {
      let rtrn: Object = await this.requestService.checkSession(
        await this.cookieService.getCookie('username'),
        await this.cookieService.getCookie('sessionToken')
      );
      if(!Object(rtrn).status){
        await this.cookieService.signOut();
      }else{
        await this.cookieService.signIn(
          await this.cookieService.getCookie('username'),
          await this.cookieService.getCookie('sessionToken')
        );
        console.log(await this.requestService.getFriends(
          await this.cookieService.getCookie('username'),
          await this.cookieService.getCookie('sessionToken'),
          10,
          1
        ));
        console.log(await this.requestService.getEnteringPendingFriendsRequests(
          await this.cookieService.getCookie('username'),
          await this.cookieService.getCookie('sessionToken'),
          10,
          1
        ));
        console.log(await this.requestService.getExitingPendingFriendsRequests(
          await this.cookieService.getCookie('username'),
          await this.cookieService.getCookie('sessionToken'),
          10,
          1
        ));
      }
    }else{
      await this.cookieService.signOut();
    }
  }
}
