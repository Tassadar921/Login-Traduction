import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../shared/services/request.service';
import {ToastService} from '../shared/services/toast.service';
import {LanguageService} from '../shared/services/language.service';
import {CookieService} from '../shared/services/cookie.service';
import {FormGroup} from '@angular/forms';
import {CryptoService} from '../shared/services/crypto.service';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {FormValidatorsService} from '../shared/services/form-validators.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public formControl: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public waiting: boolean = false;
  public output: string = '';
  private urlToken: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private toastService: ToastService,
    public languageService: LanguageService,
    private cookieService: CookieService,
    private cryptoService: CryptoService,
    public devicePlatformService: DevicePlatformService,
    private formValidatorsService: FormValidatorsService,
    private router: Router
  ) {
    this.formControl = this.formValidatorsService.getResetPasswordValidator();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      this.urlToken = Object(params).urlToken;
    });
  }

  public async confirmResetPassword() {
    this.waiting = true;
    this.output = '';
      let rtrn;
      while (!rtrn || Object(rtrn).status === -1) {
        await this.cryptoService.setRsaPublicKey();
        rtrn = await this.requestService.confirmResetPassword(
          this.urlToken,
          this.cryptoService.rsaEncryptWithPublicKey(this.formControl.value.password),
          this.cryptoService.getPublicKey()
        );
      }
      if (Object(rtrn).status === 1) {
        await this.toastService.displayToast(this.languageService.dictionary.data?.components.resetPassword.passwordResetSuccess, 'top');
        await this.router.navigateByUrl('/connection');
      } else if (Object(rtrn).status === 0) {
        this.output = this.languageService.dictionary.data?.components.resetPassword.tokenError;
      }
      this.waiting = false;
  }
}
