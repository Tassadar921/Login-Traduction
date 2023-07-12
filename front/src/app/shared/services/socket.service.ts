import { Injectable, OnInit } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { CookieService } from './cookie.service';
import { NotificationsService } from './notifications.service';
import { PagesService } from './pages.service';
import { Router } from '@angular/router';
import { socketTypes } from '../../../../../back/modules/common/socket/socketTypes';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit {

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
    private notificationsService: NotificationsService,
    private pagesService: PagesService,
    private router: Router
  ) {
    this.socket.on("initSocketData", async (): Promise<void> => {
      this.socket.emit(
        'initSocketData',
        await cookieService.getCookie('username'),
        await cookieService.getCookie('sessionToken')
      );
      this.synchronizeNotifications();
    });

    this.socket.on('synchronizeNotifications', (data: socketTypes.synchronizeNotificationsDataType): void => {
      if(data) this.notificationsService.setNotifications(data.notifications.map((notification: any) => { notification.date = new Date(notification.date); return notification; }));
    });

    this.socket.on('updateAddComponent', async (): Promise<void> => {
      if (this.router.url === '/messages') {
        await this.pagesService.onChangeAndInit('Friends');
        if (this.pagesService.currentComponent === 'add') {
          await this.pagesService.onChangeAndInit('Other');
        }
      }
    });

    this.socket.on('updateBlockedComponent', async (): Promise<void> => {
      if (this.router.url === '/messages') {
        await this.pagesService.onChangeAndInit('Friends');
        if (this.pagesService.currentComponent === 'blocked') {
          await this.pagesService.onChangeAndInit('Blocked');
        }
      }
    });

    this.socket.on('userConnected', async (username: string): Promise<void> => {
      if (this.router.url === '/messages') {
        await this.pagesService.updateFriendStatus(username, true);
      }
    });

    this.socket.on('userDisconnected', async (username: string): Promise<void> => {
      if (this.router.url === '/messages') {
        await this.pagesService.updateFriendStatus(username, false);
      }
    });
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
    this.socket.emit('deleteNotification', id);
  }
}
