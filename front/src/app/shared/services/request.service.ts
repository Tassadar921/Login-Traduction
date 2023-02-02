import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {Language} from '../models/Language.model';
import {GetResult} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(
    private http: HttpClient
  ) {}

  public async getLanguagesList () : Promise<Array<Language>> {
    return await lastValueFrom(this.http.get<Array<Language>>(environment.apiUrl + '/languages/list'));
  }

  //asks for the json of the language id selectedLanguage
  public async getTranslation(languageID: GetResult) : Promise<any> {
    return await lastValueFrom(this.http.get(environment.apiUrl + '/languages/' + languageID));
  }
}
