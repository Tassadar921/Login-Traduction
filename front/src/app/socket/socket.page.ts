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

  constructor(
    private socket: Socket
  ) {
    this.socket.on('synchronizeNotifications', (data : any) => {
      console.log(data);
      this.id = data[0].id;
    });
  }

  ngOnInit() {
    this.socket.connect();
    this.socket.emit('initSocketData',"oui" ,"oui");
  }

  public emit1() {
    this.socket.emit('synchronizeNotifications');
  }

  public emit2() {
    this.socket.emit('notificationIsSeen', this.id);

    this.emit1();
  }
  public emit3() {
    this.socket.emit('deleteNotification', this.id);

    this.emit1();
  }
}
