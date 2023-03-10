import { Component, OnInit } from '@angular/core';
import {CookieService} from "../../../services/cookie.service";
import {DevicePlatformService} from "../../../services/device-platform.service";

@Component({
  selector: 'app-default-menu',
  templateUrl: './default-menu.component.html',
  styleUrls: ['./default-menu.component.scss'],
})
export class DefaultMenuComponent implements OnInit {

  constructor(
    public cookieService: CookieService,
    public devicePlatformService: DevicePlatformService
  ) { }

  ngOnInit() {
    console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

}
