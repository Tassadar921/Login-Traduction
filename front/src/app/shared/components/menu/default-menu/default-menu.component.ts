import { Component, OnInit } from '@angular/core';
import {CookieService} from "../../../services/cookie.service";
import {DevicePlatformService} from "../../../services/device-platform.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-default-menu',
  templateUrl: './default-menu.component.html',
  styleUrls: ['./default-menu.component.scss'],
})
export class DefaultMenuComponent implements OnInit {

  constructor(
    public cookieService: CookieService,
    public devicePlatformService: DevicePlatformService,
    public router: Router
  ) {}

  ngOnInit() {}

}
