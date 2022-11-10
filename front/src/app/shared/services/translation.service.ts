import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {CookiesService} from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  public dictionnary = [];

  public languages = [];

  constructor(
    private api: ApiService,
    private cookies: CookiesService
  ) {}

  //changes language cookie for language param (id), and changes dictionnary for the new language
  updateLanguage = async (language) => {
    await this.cookies.setCookie('language', language);
    this.languages = Object(await this.api.getLanguagesList()).list;
    this.initDictionnary(Object(await this.api.getTranslation(await this.cookies.getFromCookies('language'))));
  };

  //replacing dictionnary by languageDictionnery param
  initDictionnary = (languageDictionnary) => this.dictionnary = Object(languageDictionnary);

  //initialisation of dictionnary from the cookies
  triggerOnLoad = async () => {
    if(!await this.cookies.getFromCookies('language')){
      await this.cookies.setCookie('language','uk');
    }
    await this.updateLanguage(await this.cookies.getFromCookies('language'));
  };
}

