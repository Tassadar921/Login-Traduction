import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languagesList: any[] = [];
  public dictionary: any = {};

  constructor(
    private cookieService: CookieService,
    private requestService: RequestService
  ) {}

  //initializes language service from server languages list and user language from cookies
  async init(){
    if(!await this.cookieService.getCookie('language')){
      await this.cookieService.setCookie('language', navigator.language.slice(0,2));
    }
    this.languagesList = await this.requestService.getLanguagesList();
    await this.updateLanguage(await this.cookieService.getCookie('language'));
  }

  //updates language from languageID if it exists
  async updateLanguage(languageID: string) {
    for(const language of this.languagesList){
      if(language.id === languageID){
        await this.cookieService.setCookie('language', languageID);
        this.dictionary = await this.requestService.getTranslation(await this.cookieService.getCookie('language'));
        return;
      }
    }
    await this.cookieService.setCookie('language', 'en');
    this.dictionary = await this.requestService.getTranslation(await this.cookieService.getCookie('language'));
  }
}
