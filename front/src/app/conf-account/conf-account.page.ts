import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {RequestService} from '../shared/services/request.service';
import {ToastService} from '../shared/services/toast.service';
import {LanguageService} from '../shared/services/language.service';
import {CookieService} from '../shared/services/cookie.service';

@Component({
  selector: 'app-conf-account',
  templateUrl: './conf-account.page.html',
  styleUrls: ['./conf-account.page.scss'],
})
export class ConfAccountPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private toastService: ToastService,
    private languageService: LanguageService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const rtrn = await this.requestService.confirmSignUp(Object(params).urlToken);
      if(Object(rtrn).status) {
        await this.cookieService.connect(Object(rtrn).username, Object(rtrn).token);
        await this.toastService.displayToast(
          this.languageService.dictionary.data?.components.confAccount.accountCreated, 'top', 5000
        );
        await this.router.navigateByUrl('/home');
      }else{
        await this.toastService.displayToast(
          this.languageService.dictionary.data?.components.confAccount.tokenError, 'top', 5000
        );
        await this.router.navigateByUrl('/connection');
      }
    });
  }
}
