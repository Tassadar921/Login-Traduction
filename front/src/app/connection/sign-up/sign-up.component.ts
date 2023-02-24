import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {InputCheckingService} from '../input-checking.service';
import { RequestService } from 'src/app/shared/services/request.service';
import {CryptoService} from "../../shared/services/crypto.service";

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
    public inputCheckingService: InputCheckingService,
    private requestService: RequestService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {}

  public checkUsername(): void {
    this.output = this.inputCheckingService.checkUsername(this.username);
    this.focusing = false;
  }

  public checkEmail(): void {
    this.output = this.inputCheckingService.checkEmail(this.email);
    this.focusing = false;
  }

  public checkPassword(password: boolean): void {
    if (password) {
      this.output = this.inputCheckingService.checkPassword(this.password);
    } else {
      this.output = this.inputCheckingService.checkPassword(this.confirmPassword);
      if (!this.output) {
        this.output = this.inputCheckingService.checkPasswords(this.password, this.confirmPassword);
      }
    }
    this.focusing = false;
  }

  public async mailSignUp(): Promise<void> {
    let rtrn;
    while (!rtrn || Object(rtrn).status === 3) {
      await this.cryptoService.setRsaPublicKey();
      rtrn = await this.requestService.mailSignUp(
        this.username,
        this.email,
        this.cryptoService.rsaEncryptWithPublicKey(this.password),
        this.cryptoService.getPublicKey()
      );
    }
    if (Object(rtrn).status === 1) {
      //check emails
    }else if (Object(rtrn).status === -1) {
      //something went wrong in email sending
    }else if(Object(rtrn).status === -20) {
      //wrong email shape
    }else if(Object(rtrn).status === -21) {
      //wrong password shape
    }else if(Object(rtrn).status === -22) {
      //wrong username shape
    }else if(Object(rtrn).status === -40) {
      //username already exists
    }else if (Object(rtrn).status === -41) {
      //email already exists
    }
  }
}
