import { Component, OnInit } from '@angular/core';
import {Socket} from "ngx-socket-io";
@Component({
  selector: 'app-socket',
  templateUrl: './socket.page.html',
  styleUrls: ['./socket.page.scss'],
})
export class SocketPage implements OnInit {
  constructor(
    private socket: Socket
  ) { }

  ngOnInit() {
    this.socket.connect();
  }

  public emit() {
    this.socket.emit('hello');
  }

}
