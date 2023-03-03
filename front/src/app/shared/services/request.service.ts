import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {CookieService} from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  public async getPublicKey (): Promise<Object> {
    return await lastValueFrom(this.http.get<Object>(environment.apiUrl + '/getPublicKey'));
  }

  //array containing all available languages, with their full name and id
  public async getLanguagesList (): Promise<Array<Object>> {
    return await lastValueFrom(this.http.get<Array<Object>>(environment.apiUrl + '/languages/list'));
  }

  //json of the language id selectedLanguage
  public async getTranslation(languageID: string): Promise<any> {
    return await lastValueFrom(this.http.get<Object>(environment.apiUrl + '/languages/' + languageID));
  }

  /*
  {status : -1} bad username or email shape
	{status : 0} wrong identifier or password
	{status: 1, token: token, username: username} success*/
  public async signIn(identifier: string, password: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/signIn',
      {identifier, password}
    ));
  }

  /*
  {status : -1} problem with the mail
	{status : 0} a user exist
	{status : 1} success*/
  public async mailSignUp(username: string, email: string, password: string, publicKey: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/mailSignUp',
      {username, password, email, language: await this.cookieService.getCookie('language'), publicKey},
    ));
  }

  public async test(message: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/test',
      {message},
    ));
  }

  public async createAccount(urlToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/createAccount',
      {urlToken}
    ));
  }

  public async mailResetPassword(email: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/mailResetPassword',
      {email, language: await this.cookieService.getCookie('language')}
    ));
  }

  public async resetPassword(token: string, password: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/resetPassword',
      {token, password}
    ));
  }

  public async checkSession(username: string, token: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/checkSession',
      {username, token}
    ));
  }
}
