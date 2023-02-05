import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {

  public hasAnAccount: boolean = true;
  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}

  ngOnInit() {
    // const trail = new Trail();
  }
}
