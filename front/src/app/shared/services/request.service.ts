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

  public async getLanguagesList (): Promise<Array<any>> {
    return await lastValueFrom(this.http.get<Array<any>>(environment.apiUrl + '/languages/list'));
  }

  //asks for the json of the language id selectedLanguage
  public async getTranslation(languageID: GetResult): Promise<any> {
    return await lastValueFrom(this.http.get(environment.apiUrl + '/languages/' + languageID));
  }

  public async signIn(identifier: string, password: string): Promise<any> {
    return await lastValueFrom(this.http.post(environment.apiUrl + '/signIn',
      {identifier, password}
    ));
  }

  public async mailSignUp(username: string, email: string, password: string): Promise<any> {
    return await lastValueFrom(this.http.post(environment.apiUrl + '/mailSignUp',
      {username, email, password, language: await this.cookieService.getCookie('language')},
    ));
  }
}
