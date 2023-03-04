import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../shared/services/request.service';
import {ToastService} from '../shared/services/toast.service';
import {LanguageService} from '../shared/services/language.service';
import {CookieService} from '../shared/services/cookie.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CryptoService} from '../shared/services/crypto.service';
import {DevicePlatformService} from '../shared/services/device-platform.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public formControl: any;
  public showPassword: boolean = false;
  public waiting: boolean = false;
  public output: string = '';
  private urlToken: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private toastService: ToastService,
    public languageService: LanguageService,
    private cookieService: CookieService,
    private cryptoService: CryptoService,
    public devicePlatformService: DevicePlatformService
  ) {
    this.formControl = new FormGroup({
      password: new FormControl('',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]
        })
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      this.urlToken = Object(params).token;
    });
  }

  public async resetPassword() {
    this.waiting = true;
    this.output = '';
      let rtrn;
      while (!rtrn || Object(rtrn).status === -1) {
        await this.cryptoService.setRsaPublicKey();
        rtrn = await this.requestService.resetPassword(
          this.urlToken,
          this.cryptoService.rsaEncryptWithPublicKey(this.formControl.controls.password.value),
          this.cryptoService.getPublicKey()
        );
      }
      if (Object(rtrn).status === 1) {
        this.output = this.languageService.dictionary.data?.components.resetPassword.passwordResetSuccess;
      } else if (Object(rtrn).status === 0) {
        this.output = this.languageService.dictionary.data?.components.resetPassword.tokenError;
      }
  }

  public async backToConnection() {
    await this.router.navigateByUrl('/connection');
  }

}
