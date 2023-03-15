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

  //returns the public key of the server
  public async getPublicKey (): Promise<Object> {
    return await lastValueFrom(this.http.get<Object>(environment.apiUrl + '/getPublicKey'));
  }

  //returns array containing all available languages, with their full name and id
  public async getLanguagesList (): Promise<Array<Object>> {
    return await lastValueFrom(this.http.get<Array<Object>>(environment.apiUrl + '/languages/list'));
  }

  //returns json of the language id selected language if it exists
  public async getTranslation(languageID: string): Promise<any> {
    return await lastValueFrom(this.http.get<Object>(environment.apiUrl + '/languages/' + languageID));
  }

  /*
    {status : -40} username already exists
    {status : -41} email already exists
	  {status : -3} wrong rsa public key
		{status : -20} wrong email shape
		{status : -21} wrong password shape
		{status : -22} wrong username shape
		{status : -1} problem with the mail
		{status : 1} success
	*/
  public async signIn(identifier: string, password: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/signIn',
      {identifier, password}
    ));
  }

  /*
    {status : 0} wrong identifier or password
		{status: 1, sessionToken, username, permission} success
	*/
  public async signUp(username: string, email: string, password: string, publicKey: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/signUp',
      {username, password, email, language: await this.cookieService.getCookie('language'), publicKey},
    ));
  }

  /*
    {status : 0} no such token is allowed
		{status: 1, sessionToken, username, permission} success
  */
  public async confirmSignUp(urlToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/confirmSignUp',
      {urlToken}
    ));
  }

  /*
    {status : -2} bad mail shape
		{status : -1} problem with the mail
		{status : 0} no such user
		{status : 1} success
  */
  public async resetPassword(email: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/mailResetPassword',
      {email, language: await this.cookieService.getCookie('language')}
    ));
  }

  /*
    {status : 0} no such token in db
		{status : 1} success
  */
  public async confirmResetPassword(urlToken: string, password: string, publicKey: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/resetPassword',
      {urlToken, password, publicKey}
    ));
  }

  /*
    {status : 0} no such token is allowed to this user
		{status : 1} everything is fine
  */
  public async checkSession(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(environment.apiUrl + '/checkSession',
      {username, sessionToken}
    ));
  }
}
