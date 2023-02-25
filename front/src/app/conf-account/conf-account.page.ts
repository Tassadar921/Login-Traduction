import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {RequestService} from '../shared/services/request.service';
import {ToastService} from '../shared/services/toast.service';
import {LanguageService} from '../shared/services/language.service';

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
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const rtrn = await this.requestService.createAccount(Object(params).urlToken);
      if(Object(rtrn).status) {
        await this.toastService.displayToast(
          this.languageService.dictionary.data.components.confAccount.tokenError, 'top'
        );
        await this.router.navigateByUrl('/home');
      }else{
        await this.toastService.displayToast(
          this.languageService.dictionary.data.components.confAccount.accountCreated, 'top'
        );
        await this.router.navigateByUrl('/connection');
      }
    });
  }
}
