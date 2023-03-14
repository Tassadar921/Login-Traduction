import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from "../../services/device-platform.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public menuItems = [
    'Home',
    'Friends',
    'Messages',
  ]

  constructor(
    public devicePlatformService: DevicePlatformService
  ) {}

  ngOnInit() {}
}
