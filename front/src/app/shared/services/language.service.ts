import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languagesList: any[] = [];
  public dictionary = {
    "header":
      {
        "tag": "uk"
      },
    "data": {
      "components": {
        "connection": {
          "signIn": "Sign in",
          "signUp": "Sign up"
        }
      },
      "services": {
        "inputChecking": {
          "usernameTooShort": "Username is too short",
          "usernameTooLong": "Username is too long",
          "usernameContainsInvalidCharacter": "Username contains invalid character",
          "passwordTooShort": "Password is too short",
          "passwordTooLong": "Password is too long",
          "passwordContainsInvalidCharacter": "Password contains invalid character",
          "passwordMissesUpperCase": "Password misses upper case",
          "passwordMissesLowerCase": "Password misses lower case",
          "passwordMissesNumber": "Password misses number",
          "passwordMissesSpecialChar": "Password misses special character",
          "passwordsDontMatch": "Passwords don't match",
          "emailTooShort": "Email is too short",
          "emailTooLong": "Email is too long",
          "emailMissesAt": "Email misses @",
        }
      }
    }
  };

  constructor(
    private cookieService: CookieService,
    private requestService: RequestService
  ) {}

  async init(){
    if(!await this.cookieService.getCookie('language')){
      await this.cookieService.setCookie('language', 'uk');
    }
    this.languagesList = await this.requestService.getLanguagesList();
    this.dictionary = await this.requestService.getTranslation(await this.cookieService.getCookie('language'));
  }
  async updateLanguage(languageID: string) {
    await this.cookieService.setCookie('language', languageID);
    this.dictionary = await this.requestService.getTranslation(await this.cookieService.getCookie('language'));
  }
}
