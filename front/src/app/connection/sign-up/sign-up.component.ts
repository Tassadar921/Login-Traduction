import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {RequestService} from 'src/app/shared/services/request.service';
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
  public waiting = false;
  public supportEmail = '';
  public mailError = false;
  public formControl: any;

  constructor(
    public devicePlatformService: DevicePlatformService,
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
            Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{3,20}$'),
            Validators.minLength(3),
            Validators.maxLength(20)
          ]}
      ), email: new FormControl(
      '',
      {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.email
        ]}
    ), password: new FormControl(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)

          ]}

      ), confirmPassword: new FormControl(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]}
      )
    });
  }

  ngOnInit() {}

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
