import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {InputCheckingService} from '../input-checking.service';
import { RequestService } from 'src/app/shared/services/request.service';
import {CryptoService} from "../../shared/services/crypto.service";
import {LanguageService} from '../../shared/services/language.service';
import {environment} from '../../../environments/environment';
import {Clipboard} from '@angular/cdk/clipboard';
import {ToastService} from '../../shared/services/toast.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../connection.page.scss'],
})
export class SignUpComponent implements OnInit {
  public showPassword = false;
  public showConfirmPassword = false;
  public output = '';
  public focusing = false;
  public waiting = false;
  public supportEmail = '';
  public mailError = false;
  public formControl: any;

  constructor(
    public devicePlatformService: DevicePlatformService,
    public inputCheckingService: InputCheckingService,
    private requestService: RequestService,
    private cryptoService: CryptoService,
    public languageService: LanguageService,
    private toastService: ToastService,
    public clipboard: Clipboard
  ) {
    this.supportEmail = environment.supportEmail;
    this.formControl = new FormGroup({
      username: new FormControl(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{3,20}$')
          ]}
      ), email: new FormControl(
      '',
      {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$')
        ]}
    ), password: new FormControl(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$')
          ]}

      ), confirmPassword: new FormControl(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$')
          ]}
      )
    });
  }

  ngOnInit() {}

  public checkUsername(): void {
    this.output = this.inputCheckingService.checkUsername(this.formControl.controls.username.value);
    this.focusing = false;
  }

  public checkEmail(): void {
    this.output = this.inputCheckingService.checkEmail(this.formControl.controls.email.value);
    this.focusing = false;
  }

  public checkPassword(password: boolean): void {
    if (password) {
      this.output = this.inputCheckingService.checkPassword(this.formControl.controls.password.value);
    } else {
      this.output = this.inputCheckingService.checkPassword(this.formControl.controls.confirmPassword.value);
      if (!this.output) {
        this.output = this.inputCheckingService.checkPasswords(
          this.formControl.controls.password.value,
          this.formControl.controls.confirmPassword.value);
      }
    }
    this.focusing = false;
  }

  public async mailSignUp(): Promise<void> {
    this.waiting = true;
    this.mailError = false;
    let rtrn;
    while (!rtrn || Object(rtrn).status === 3) {
      await this.cryptoService.setRsaPublicKey();
      rtrn = await this.requestService.mailSignUp(
        this.formControl.controls.username.value,
        this.formControl.controls.email.value,
        this.cryptoService.rsaEncryptWithPublicKey(this.formControl.controls.password.value),
        this.cryptoService.getPublicKey()
      );
    }
    console.log(rtrn);
    if (Object(rtrn).status === 1) {
      this.output = this.languageService.dictionary.data.components.signUp.checkYourMails;
    } else if (Object(rtrn).status === -1) {
      this.output = this.languageService.dictionary.data.components.signUp.mailSendingError;
      this.mailError = true;
    } else if (Object(rtrn).status === -20) {
      this.output = this.languageService.dictionary.data.components.signUp.emailWrongFormat;
    } else if (Object(rtrn).status === -21) {
      this.output = this.languageService.dictionary.data.components.signUp.passwordWrongFormat;
    } else if (Object(rtrn).status === -22) {
      this.output = this.languageService.dictionary.data.components.signUp.usernameWrongFormat;
    } else if (Object(rtrn).status === -40) {
      this.output = this.languageService.dictionary.data.components.signUp.usernameAlreadyExists;
    } else if (Object(rtrn).status === -41) {
      this.output = this.languageService.dictionary.data.components.signUp.emailAlreadyExists;
    }
    this.waiting = false;
  }

  public async copyEmail(): Promise<void> {
    this.clipboard.copy(this.supportEmail);
    await this.toastService.displayToast(this.languageService.dictionary.data.components.signUp.emailCopied, 'top');
  }
}
