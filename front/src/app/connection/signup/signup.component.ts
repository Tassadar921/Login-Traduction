import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../shared/services/translation.service';
import {ApiService} from '../../shared/services/api.service';
import {LoginService} from '../../shared/services/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../../shared.scss'],
})
export class SignupComponent implements OnInit {

  public username = '';
  public outputUsername = '';

  public email = '';
  public outputEmail = '';

  public output = '';
  public waiting = 0;

  private retour;

  constructor(
    public translate: TranslationService,
    public api: ApiService,
    public loginService: LoginService
  ) {
  }

  ngOnInit() {}

  signUp = async () => {
    this.waiting=1;
    this.output = '';
    this.retour = await this.api.userExists(this.username, this.email);
    if (this.retour.status === 0) {
      this.output = this.retour.message;
      this.waiting=0;
    } else {
      this.retour = await this.api.mailCreateAccount(this.username, this.loginService.password, this.email);
      this.output = this.retour.message;
      this.waiting=0;
    }
  };

  checkUsername = () => this.outputUsername = this.loginService.updateUsername(this.username);

  checkEmail = () => {
    this.outputEmail = this.loginService.updateEmail(this.email);
    console.log(this.outputEmail = this.loginService.updateEmail(this.email));
  };
}


