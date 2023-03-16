import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from "../../services/device-platform.service";
import {RequestService} from "../../services/request.service";
import {CookieService} from '../../services/cookie.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  //menu items dynamically generated from this array
  //put the name from here : https://ionic.io/ionicons
  public menuItems = [
    {name: 'Home', icon: 'home', link: '/home'},
    {name: 'Messages', icon: 'send', link: '/messages'},
    {name: 'Friends', icon: 'people', link: '/friends'}
  ]

  constructor(
    public devicePlatformService: DevicePlatformService,
    public requestService: RequestService,
    private cookieService: CookieService,
  ) {}

  ngOnInit() {}

  public async signOut() {
    const rtrn = await this.requestService.signOut(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
    if (Object(rtrn).status === 1) {
      await this.cookieService.signOut();
    }
  }
}
