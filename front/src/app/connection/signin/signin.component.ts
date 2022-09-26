import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../shared/services/translation.service';
import {ApiService} from '../../shared/services/api.service';
import {CookiesService} from '../../shared/services/cookies.service';
import {Router} from '@angular/router';
import {ToastService} from '../../shared/services/toast.service';
import {LoginService} from '../../shared/services/login.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../signup/signup.component.scss', '../../shared.scss'],
})
export class SigninComponent implements OnInit {

  public username = '';
  public password = '';
  public output = '';

  private retour;

  constructor(
    public translate: TranslationService,
    private api: ApiService,
    private cookies: CookiesService,
    private router: Router,
    private toastService: ToastService,
    public loginService: LoginService
  ) {}

  ngOnInit() {}

  submit = async () => {
    this.retour = await this.api.signIn(this.username, this.password);
    if(this.retour.status){
      await this.cookies.setCookie('username', this.username);
      await this.toastService.presentToast('Connected as ' + this.username, '5000', 'bottom');
      await this.router.navigateByUrl('/home');
    }
    this.output = this.retour.message;
  };
}
