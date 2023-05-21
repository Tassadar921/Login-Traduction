import { Injectable, OnInit } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { CookieService } from './cookie.service';
import {NotificationsService} from './notifications.service';
import { PagesService } from './pages.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
    private notificationsService: NotificationsService,
    private pagesService: PagesService
  ) {
    this.socket.on("initSocketData", async (): Promise<void> => {
      this.socket.emit(
        'initSocketData',
        await cookieService.getCookie('username'),
        await cookieService.getCookie('sessionToken')
      );
      this.synchronizeNotifications();
    });

    this.socket.on('synchronizeNotifications', (data : any): void => {
        this.notificationsService.setNotifications(data.map((notification : any) => {notification.date = new Date(notification.date); return notification;}));
    });

    this.socket.on('updateAddComponent', async (): Promise<void> => {
      if(this.pagesService.currentComponent === 'add'){
        await this.pagesService.onChangeAndInit('Other');
        await this.pagesService.onChangeAndInit('Friends');
      }
    });
    // console.log(navController.navigateForward('/home'));
  }

  ngOnInit(): void {
    this.socket.connect();
    this.socket.emit('synchronizeNotifications');
  }

  public synchronizeNotifications(): void {
    this.socket.emit('synchronizeNotifications');
  }

  public async addNotificationAskFriend(username: string): Promise<void> {
    this.socket.emit('addNotificationAskFriend', username);
  }

  public deleteNotification(id: string): void {
    console.log(id);
    this.socket.emit('deleteNotification', id);
  }
}
