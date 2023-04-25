import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from "../shared/services/device-platform.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  constructor(
    public devicePlatformService: DevicePlatformService
  ) { }

  ngOnInit() {
  }

}
