import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../shared/services/api.service';
import {TranslationService} from '../shared/services/translation.service';
import {LoginService} from '../shared/services/login.service';
import {SignupComponent} from '../connection/signup/signup.component';
import {CookiesService} from '../shared/services/cookies.service';
import {ToastService} from '../shared/services/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  @ViewChild(SignupComponent) signupComponent: SignupComponent;

  public retour;

  public waiting = false;

  private token;

  constructor(
    private getVarInURL: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    public translate: TranslationService,
    public loginService: LoginService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.translate.triggerOnLoad(); //new page, needs initialisation
    this.getVarInURL.queryParams.subscribe(async params => { //get token param from URL
      this.retour = await this.api.checkResetPasswordToken(params.token);
      if(this.retour.status){
        this.token = params.token;
      }
    });
  }

  submit = async () => {
    this.waiting = true;
    this.retour = await this.api.resetPassword(this.loginService.password, this.token);
    await this.toastService.presentToast(this.retour.message, 5000, 'Bottom');
  };
}
