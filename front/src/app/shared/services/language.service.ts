import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { RequestService } from './request.service';
import { Language } from '../models/Language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languagesList: Array<Language> | undefined;
  public dictionary = [];

  constructor(
    private cookieService: CookieService,
    private requestService: RequestService
  ) {}

  async init(){
    if(!await this.cookieService.getCookie('language')){
      await this.cookieService.setCookie('language', 'uk');
    }
    this.languagesList = await this.requestService.getLanguagesList();
    console.log(this.languagesList)
    // this.dictionary = await this.requestService.getTranslation(await this.cookieService.getCookie('language'));
  }
  async updateLanguage(languageID: string) {}




}
