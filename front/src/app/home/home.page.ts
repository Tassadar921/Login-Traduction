import { Component } from '@angular/core';
import { DevicePlatformService } from "../shared/services/device-platform.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage {
  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}

  public onSidenavClose = () => {

  }
}
