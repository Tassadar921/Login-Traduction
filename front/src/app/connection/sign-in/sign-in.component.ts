import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {InputCheckingService} from '../input-checking.service';

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
  public focusing = false;

  constructor(
      public devicePlatformService: DevicePlatformService,
      public inputCheckingService: InputCheckingService
  ) { }

  ngOnInit() {}

  public checkUsername():void {
    this.output = this.inputCheckingService.checkUsername(this.username);
    this.focusing = false;
  }

  public checkPassword():void {
    this.output = this.inputCheckingService.checkPassword(this.password);
    this.focusing = false;
  }

  public signIn() {

  }
}
