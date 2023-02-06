import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../connection.page.scss'],
})
export class SignUpComponent implements OnInit {

  public showPassword = false;
  public showConfirmPassword = false;
  constructor(
    public devicePlatformService: DevicePlatformService,
  ) {}

  ngOnInit() {}

  public signUp() {

  }

}
