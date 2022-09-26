import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CookiesService} from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private retour;
  constructor(
    private http: HttpClient,
    private cookies: CookiesService,
  ) { }

  //asks for the json index of languages
  getLanguagesList = async () => {
    await this.http.get<string>(environment.urlBack + 'getLanguagesList').toPromise().then(response => {
      this.retour = response;
    });
    return this.retour.list;
  };

  //asks for the json of the language id selectedLanguage
  getTranslation = async (selectedLanguage) => {
    const data = {
      language: selectedLanguage
    };
    await this.http.post<string>(environment.urlBack + 'getTranslation', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour.list;
  };

  //asks if an account containing username or email is in db, priority to username
  userExists = async (username, email) => {
    const data = {
      username,
      email,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'userExists', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //sends the creating account email, containing a unique token, effective for 5 minutes,
  // temporary saving datas in the signUp queue
  mailCreateAccount = async (username, password, email) => {
    const data = {
      username,
      password,
      email,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'mailCreateAccount', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //asks if token is in the signUp queue
  checkSignUpToken = async (token) => {
    const data = {
      token,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'checkSignUpToken', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //creates the account with datas in the queue linked to token
  createAccount = async (token) => {
    const data = {
      token,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'createAccount', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //signIn, identifier can be either username or email
  signIn = async (identifier, password) => {
    const data = {
      identifier,
      password,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'signIn', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //sends an email containing a unique token to reset the password, effective for 5 minutes
  //temporary linking the token and email in the resetPassword queue
  mailResetPassword = async (email) => {
    const data = {
      email,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'mailResetPassword', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //asks if token is in the resetPassword queue
  checkResetPasswordToken = async (token) => {
    const data = {
      token,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'checkResetPasswordToken', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };

  //resets the password of the account linked to the email, himself linked to the token
  resetPassword = async (token, password) => {
    const data = {
      token,
      password,
      language: await this.cookies.getFromCookies('language')
    };
    await this.http.post<string>(environment.urlBack + 'resetPassword', data).toPromise().then(response => {
      this.retour = response;
    });
    return this.retour;
  };
}
