import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {InputCheckingService} from '../input-checking.service';
import { RequestService } from 'src/app/shared/services/request.service';
import {CryptoService} from "../../shared/services/crypto.service";
import {lastValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

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

  public async mailSignUp() {
    console.log('front key : ', this.cryptoService.publicKey);
    console.log('back key : ', Object(await this.requestService.getPublicKey()).publicKey);
    let rtrn;
    while(!rtrn || Object(rtrn).status===3){
      await this.cryptoService.setRsaPublicKey();
      rtrn = await this.requestService.mailSignUp(
        this.username,
        this.email,
        this.cryptoService.rsaEncryptWithPublicKey(this.password),
        this.cryptoService.getPublicKey()
      );
    }
    console.log(rtrn);
  }
}
