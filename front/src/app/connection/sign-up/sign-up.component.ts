import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {InputCheckingService} from '../input-checking.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../connection.page.scss'],
})
export class SignUpComponent implements OnInit {

  public email = '';
  public username = '';
  public password = '';
  public confirmPassword = '';
  public showPassword = false;
  public showConfirmPassword = false;
  public output = '';
  public focusing = false;
  constructor(
    public devicePlatformService: DevicePlatformService,
    public inputCheckingService: InputCheckingService
  ) {}

  ngOnInit() {}

  public checkUsername():void {
    this.output = this.inputCheckingService.checkUsername(this.username);
    this.focusing = false;
  }

  public checkEmail():void {
    this.output = this.inputCheckingService.checkEmail(this.email);
    this.focusing = false;
  }

  public checkPassword(password: boolean):void {
    if (password) {
      this.output = this.inputCheckingService.checkPassword(this.password);
      //action sur input
    }else{
      this.output = this.inputCheckingService.checkPassword(this.confirmPassword);
      if(!this.output){
        this.output = this.inputCheckingService.checkPasswords(this.password, this.confirmPassword);
        //action sur input
      }else {
        //action sur input
      }
    }
    this.focusing = false;
  }

  public signUp() {

  }

}
