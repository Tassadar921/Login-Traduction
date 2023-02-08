import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../connection.page.scss'],
})
export class SignInComponent implements OnInit {

  public showPassword = false;
  public output = '';
  public username = '';
  public password = '';

  constructor(
      public devicePlatformService: DevicePlatformService
  ) {}

  ngOnInit() {}

  public signIn() {

  }
}
