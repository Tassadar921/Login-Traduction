import { Injectable } from '@angular/core';
import {PagesService} from './pages.service';
import {RequestService} from './request.service';
import {CookieService} from './cookie.service';
import {SocketService} from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  public currentComponent: string = 'add';

  constructor(
    private pagesService: PagesService,
    private requestService: RequestService,
    private cookieService: CookieService,
    private socketService: SocketService
  ) {}

  public async askIfNotAddFriend(username: string, notification: boolean, ask: boolean, id: string = ''): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.askIfNotAddFriend(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      username
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      if(ask){
        await this.socketService.addNotificationAskFriend(username);
      }else{
        this.socketService.deleteNotification(id);
      }
      if(!notification) {
        await this.pagesService.onChangeAndInit('Other');
      }
    }
  }

  public async refuseFriendRequest(senderUsername: string, notification: boolean, id: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.refuseFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      senderUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      this.socketService.deleteNotification(id);
      if(!notification) {
        await this.pagesService.onChangeAndInit('Other');
      }
    }
  }

  public async cancelFriendRequest(receiverUsername: string, id: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.cancelFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      receiverUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Other');
      this.socketService.deleteNotification(id);
    }
  }
}
