import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {GetResult} from '@capacitor/preferences';
import {CookieService} from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  public async getPublicKey (): Promise<Object> {
    return await lastValueFrom(this.http.get<Object>(environment.apiUrl + '/getPublicKey'));
  }

  //array containing all available languages, with their full name and id
  public async getLanguagesList (): Promise<Array<Object>> {
    return await lastValueFrom(this.http.get<Array<Object>>(environment.apiUrl + '/languages/list'));
  }

  //json of the language id selectedLanguage
  public async getTranslation(languageID: GetResult): Promise<any> {
    return await lastValueFrom(this.http.get(environment.apiUrl + '/languages/' + languageID));
  }

  /*
  {status : -1} bad username or email shape
	{status : 0} wrong identifier or password
	{status: 1, token: token, username: username} success*/
  public async signIn(identifier: string, password: string): Promise<any> {
    return await lastValueFrom(this.http.post(environment.apiUrl + '/signIn',
      {identifier, password}
    ));
  }

  /*
  {status : -1} problem with the mail
	{status : 0} a user exist
	{status : 1} success*/
  public async mailSignUp(username: string, email: string, password: string): Promise<any> {
    return await lastValueFrom(this.http.post(environment.apiUrl + '/mailSignUp',
      {username, email, password, language: await this.cookieService.getCookie('language')},
    ));
  }

  public async createAccount(urlToken: string): Promise<any> {
    return await lastValueFrom(this.http.post(environment.apiUrl + '/createAccount',
      {urlToken}
    ));
  }
}
