import { Component, OnInit } from '@angular/core';
import {CookieService} from "../shared/services/cookie.service";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-socket',
  templateUrl: './socket.page.html',
  styleUrls: ['./socket.page.scss'],
})
export class SocketPage implements OnInit {
  private id: string = "";
  notification : [{id : string, title : string, text : string, date : Date, seen : boolean}] | undefined;
  lastMessage : [{sender : {username : string}, seen : boolean, date : Date, text : string}] | undefined;
  messageSuccess : boolean = false;

  constructor(private socket: Socket, private cookieService: CookieService) {
    this.socket.on("initSocketData", async (): Promise<void> => {
      this.socket.emit('initSocketData',await cookieService.getCookie('username'),await cookieService.getCookie('sessionToken'));
      this.socket.emit('synchronizeNotifications');
    });
    this.socket.on('synchronizeNotifications', (data : any): void => {
      console.log(data);
      if(data.length > 0) {

        this.notification = data.map((notification : any) => {notification.date = new Date(notification.date); return notification;});
        this.id = data[0].id;
      }
      else {
        this.notification = undefined;
      }
    });

    this.socket.on('message', (): void => {
      this.socket.emit('getChat');
      this.socket.emit('synchronizeNotifications');
    });

    this.socket.on('getMessage', (data : any): void => {
      this.lastMessage = data.map((lastMessage : any) => {lastMessage.date = new Date(lastMessage.date); return lastMessage;})
    });
  }

  ngOnInit(): void {
    this.socket.connect();
    this.socket.emit('synchronizeNotifications');
  }

  public emit1(): void {
    this.socket.emit('synchronizeNotifications');
  }
  public emit2(): void {
    this.socket.emit('notificationIsSeen', this.id);
  }
  public emit3(): void {
    this.socket.emit('deleteNotification', this.id);
  }
  public async emit4(): Promise<void> {
    this.socket.emit('addNotifications', await this.cookieService.getCookie('username'), "titre", "texte");
  }
  public async emit5(): Promise<void> {
    this.socket.emit('sendMessage', await this.cookieService.getCookie('username'), "texte");
    this.messageSuccess = false;
  }
  public emit6(): void {
    this.socket.emit('getChat');
  }
}
