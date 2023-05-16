import {Injectable, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {CookieService} from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{

  constructor(
    private socket: Socket,
    private cookieService: CookieService
  ) {
    this.socket.on("initSocketData", async (): Promise<void> => {
      this.socket.emit(
        'initSocketData',
        await cookieService.getCookie('username'),
        await cookieService.getCookie('sessionToken')
      );
      this.socket.emit('synchronizeNotifications');
    });
  }

  ngOnInit(): void {
    this.socket.connect();
    this.socket.emit('synchronizeNotifications');
  }
}
