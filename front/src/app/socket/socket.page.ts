import { Component, OnInit } from '@angular/core';
import { UserBuildConditionals } from 'ionicons/dist/types/stencil-public-runtime';

import {Socket} from "ngx-socket-io";
import { emit } from 'process';
@Component({
  selector: 'app-socket',
  templateUrl: './socket.page.html',
  styleUrls: ['./socket.page.scss'],
})
export class SocketPage implements OnInit {
  private id = "";
  notification : [{id : string, title : string, text : string, date : Date, seen : boolean}] | undefined;
  lastMessage : {username : string, message : string, date : Date} | undefined;

  constructor(private socket: Socket) {
    this.socket.on("initSocketData", () => {
      this.socket.emit('initSocketData',"oui" ,"oui");
      this.socket.emit('synchronizeNotifications');
    });
    this.socket.on('synchronizeNotifications', (data : any) => {
      console.log(data);
      if(data.length > 0) {

        this.notification = data.map((notification : any) => {notification.date = new Date(notification.date); return notification;});
        this.id = data[0].id;
      }
    });
    this.socket.on('sendMessage', (username : string, message : string, date : string) => {
      this.lastMessage = {username, message, date : new Date(date)};
    });
  }

  ngOnInit() {
    this.socket.connect();
  }

  public emit1() {
    this.socket.emit('synchronizeNotifications');
  }

  public emit2() {
    this.socket.emit('notificationIsSeen', this.id);
  }
  public emit3() {
    this.socket.emit('deleteNotification', this.id);
  }
  public emit4() {
    this.socket.emit('addNotifications', "oui", "titre", "texte");
  }
  public emit5() {
    this.socket.emit('sendMessage', "oui", "texte", Date.now());
  }
}
