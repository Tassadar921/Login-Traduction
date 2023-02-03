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
    "data": []
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
    console.log(this.dictionary)
  }




}
