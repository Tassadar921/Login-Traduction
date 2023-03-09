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

  async ngOnInit() {
    await this.languageService.init();
    await this.cryptoService.setRsaPublicKey();
    if(await this.cookieService.getCookie('token')) {
      console.log(await this.cookieService.getCookie('token'));
      console.log(await this.cookieService.getCookie('username'));
      console.log('on a un token');
      let rtrn = await this.requestService.checkSession(
        await this.cookieService.getCookie('username'), await this.cookieService.getCookie('token')
      );
      console.log(rtrn);
      if(!Object(rtrn).status){
        // await this.cookieService.disconnect();
      }else{
        console.log('et il est bon')
        await this.cookieService.connect(
          await this.cookieService.getCookie('username'),
          await this.cookieService.getCookie('token')
        );
      }
    }else{
      // await this.cookieService.disconnect();
    }
  }
}
