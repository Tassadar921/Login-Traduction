import {Component} from '@angular/core';
import {DevicePlatformService} from "../shared/services/device-platform.service";

/** @title Sidenav with custom escape and backdrop click behavior */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage {
  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}
}
