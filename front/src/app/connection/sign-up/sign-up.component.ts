import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {RequestService} from 'src/app/shared/services/request.service';
import {CryptoService} from '../../shared/services/crypto.service';
import {LanguageService} from '../../shared/services/language.service';
import {environment} from '../../../environments/environment';
import {Clipboard} from '@angular/cdk/clipboard';
import {ToastService} from '../../shared/services/toast.service';
import {FormGroup} from '@angular/forms';
import {FormValidatorsService} from '../../shared/services/form-validators.service';

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
  public supportEmail = environment.supportEmail;
  public mailError = false;
  public formControl: FormGroup;

  constructor(
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService,
    private cryptoService: CryptoService,
    public languageService: LanguageService,
    private toastService: ToastService,
    public clipboard: Clipboard,
    private formValidatorsService: FormValidatorsService,
  ) {
    this.formControl = this.formValidatorsService.getSignUpValidator();
  }

  ngOnInit() {
    document.addEventListener('keydown', async (event) => {
      if(event.key === 'Enter' && this.formControl.valid){
        await this.signUp();
      }
    });
  }

  public async signUp(): Promise<void> {
    this.waiting = true;
    this.mailError = false;
    this.output = '';
    let rtrn;
    while (!rtrn || Object(rtrn).status === 3) {
      await this.cryptoService.setRsaPublicKey();
      rtrn = await this.requestService.signUp(
        this.formControl.value.username,
        this.formControl.value.email,
        this.cryptoService.rsaEncryptWithPublicKey(this.formControl.value.password),
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
    console.log(rtrn);
    this.waiting = false;
  }

  public async copyEmail(): Promise<void> {
    this.clipboard.copy(this.supportEmail);
    await this.toastService.displayToast(this.languageService.dictionary.data.components.signUp.emailCopied, 'top');
  }
}
