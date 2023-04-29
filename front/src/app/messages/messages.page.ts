import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {LanguageService} from '../shared/services/language.service';
import {RequestService} from '../shared/services/request.service';
import {CookieService} from '../shared/services/cookie.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  constructor(
    public devicePlatformService: DevicePlatformService,
    public languageService: LanguageService,
    private requestService: RequestService,
    private cookieService: CookieService
  ) {}

  async ngOnInit(): Promise<void> {
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
    console.log(await this.requestService.getOtherUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      10,
      1
    ));
  }
}
