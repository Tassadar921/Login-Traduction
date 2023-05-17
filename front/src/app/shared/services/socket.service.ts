import {Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {CookieService} from './cookie.service';
import {NotificationsService} from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
    private notificationsService: NotificationsService
  ) {
    this.socket.on("initSocketData", async (): Promise<void> => {
      this.socket.emit(
        'initSocketData',
        await cookieService.getCookie('username'),
        await cookieService.getCookie('sessionToken')
      );
      this.socket.emit('synchronizeNotifications');
    });
    this.socket.on('synchronizeNotifications', (data : any): void => {
        this.notificationsService.setNotifications(data.map((notification : any) => {notification.date = new Date(notification.date); return notification;}));
    });
  }

  ngOnInit(): void {
    this.socket.connect();
    this.socket.emit('synchronizeNotifications');
  }

  public async addNotificationAskFriend(username: string): Promise<void> {
    this.socket.emit('addNotificationAskFriend', username);
  }
}
