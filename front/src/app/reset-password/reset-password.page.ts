import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../shared/services/request.service";
import {ToastService} from "../shared/services/toast.service";
import {LanguageService} from "../shared/services/language.service";
import {CookieService} from "../shared/services/cookie.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CryptoService} from "../shared/services/crypto.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public formControl: any;
  public showPassword: boolean = false;
  public waiting: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private toastService: ToastService,
    public languageService: LanguageService,
    private cookieService: CookieService,
    private cryptoService: CryptoService

  ) {
    this.formControl = new FormGroup({
      password: new FormControl('',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]})
    });
  }

  ngOnInit() {}

  public resetPassword() {
    this.waiting = true;
    this.activatedRoute.queryParams.subscribe(async params => {
      const rtrn = await this.requestService.resetPassword(Object(params).urlToken,
        this.cryptoService.sha256(this.formControl.controls.password.value));
      this.waiting = false;
      if(Object(rtrn).status) {
        // you can now sign in
      }else{
        //something went wrong with the token
      }
    });
  }

  public async backToConnection(){
    await this.router.navigateByUrl('connection');
  }

}
