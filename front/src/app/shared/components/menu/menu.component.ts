import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from "../../services/device-platform.service";
import {RequestService} from "../../services/request.service";
import {CookieService} from '../../services/cookie.service';
import {LanguageService} from "../../services/language.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  //menu items dynamically generated from this array
  //put the name from here : https://ionic.io/ionicons
  public menuItems: Array<Object> = [];

  constructor(
    public devicePlatformService: DevicePlatformService,
    public requestService: RequestService,
    private cookieService: CookieService,
    private languageService: LanguageService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.languageService.dictionaryChanged.subscribe((): void => {
      this.menuItems = [
        {
          name: this.languageService.dictionary.data?.components.menu.home,
          icon: 'home',
          link: '/home'
        }, {
          name: this.languageService.dictionary.data?.components.menu.messages,
          icon: 'send',
          link: '/messages'
        }
      ]
    });
    await this.languageService.init();
  }

  public async signOut(popover: boolean = false): Promise<void> {
    const rtrn: Object = await this.requestService.signOut(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
    if (Object(rtrn).status === 1) {
      logger.logger.info(popover);
      await this.cookieService.signOut(popover);
    }
  }
}
