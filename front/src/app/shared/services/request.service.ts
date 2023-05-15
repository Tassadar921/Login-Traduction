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

  public async test(message: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/test`,
      { message }
    ));
  }

  //returns array containing all available languages, with their full name and id
  public async getLanguagesList (): Promise<Array<Object>> {
    return await lastValueFrom(this.http.get<Array<Object>>(`${environment.apiUrl}/languages/list`));
  }

  //returns json of the language id selected language if it exists
  public async getTranslation(languageID: string): Promise<any> {
    return await lastValueFrom(this.http.get<Object>(`${environment.apiUrl}/languages/${languageID}`));
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
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/signIn`,
      { identifier, password }
    ));
  }

  /*
    {status : 0} wrong identifier or password
		{status: 1, sessionToken, username, permission} success
	*/
  public async signUp(username: string, email: string, password: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/signUp`,
      { username, password, email, language: await this.cookieService.getCookie('language') },
    ));
  }

  /*
    {status : 0} no such token is allowed
		{status: 1, sessionToken, username, permission} success
  */
  public async confirmSignUp(urlToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/confirmSignUp`,
      { urlToken }
    ));
  }

  /*
    {status : -2} bad mail shape
		{status : -1} problem with the mail
		{status : 0} no such user
		{status : 1} success
  */
  public async resetPassword(email: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/resetPassword`,
      { email, language: await this.cookieService.getCookie('language') }
    ));
  }

  /*
    {status : 0} no such token in db
		{status : 1} success
  */
  public async confirmResetPassword(urlToken: string, password: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/confirmResetPassword`,
      { urlToken, password }
    ));
  }

  public async signOut(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/signOut`,
      { username, sessionToken }
    ));
  }

  /*
    {status : 0} no such token is allowed to this user
		{status : 1} everything is fine
  */
  public async checkSession(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/checkSession`,
      { username, sessionToken }
    ));
  }

  public async getFriendUsers(username: string, sessionToken: string, itemsPerPage: number, page: number): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getFriendUsers`,
      { username, sessionToken, itemsPerPage, page }
    ));
  }

  public async getFriendUsersNumber(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getFriendUsersNumber`,
      { username, sessionToken }
    ));
  }

  public async getEnteringPendingFriendsRequests(username: string, sessionToken: string, itemsPerPage: number, page: number): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getEnteringPendingFriendsRequests`,
      { username, sessionToken, itemsPerPage, page }
    ));
  }

  public async getOtherUsers(username: string, sessionToken: string, itemsPerPage: number, page: number): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getOtherUsers`,
      { username, sessionToken, itemsPerPage, page }
    ));
  }

  public async getOthersUsersNumber(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getOtherUsersNumber`,
      { username, sessionToken }
    ));
  }

  public async askIfNotAddFriend(senderUsername: string, sessionToken: string, receiverUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/askIfNotAddFriend`,
      { senderUsername, sessionToken, receiverUsername }
    ));
  }

  public async refuseFriendRequest(username: string, sessionToken: string, senderUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/refuseFriendRequest`,
      { username, sessionToken, senderUsername }
    ));
  }

  public async cancelFriendRequest(username: string, sessionToken: string, receiverUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/cancelFriendRequest`,
      { username, sessionToken, receiverUsername }
    ));
  }

  public async removeFriend(username: string, sessionToken: string, receiverUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/removeFriend`,
      { username, sessionToken, receiverUsername }
    ));
  }

  public async blockUser(username: string, sessionToken: string, blockedUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/blockUser`,
      { username, sessionToken, blockedUsername }
    ));
  }

  public async unblockUser(username: string, sessionToken: string, blockedUsername: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/unblockUser`,
      { username, sessionToken, blockedUsername }
    ));
  }

  public async getBlockedUsers(username: string, sessionToken: string, itemsPerPage: number, page: number): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getBlockedUsers`,
      { username, sessionToken, itemsPerPage, page }
    ));
  }

  public async getBlockedUsersNumber(username: string, sessionToken: string): Promise<Object> {
    return await lastValueFrom(this.http.post<Object>(`${environment.apiUrl}/getBlockedUsersNumber`,
      { username, sessionToken }
    ));
  }
}
