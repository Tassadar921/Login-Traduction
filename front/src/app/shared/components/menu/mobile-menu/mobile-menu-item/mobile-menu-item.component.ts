import { Component, Input, OnInit } from '@angular/core';
import { DevicePlatformService } from '../../../../services/device-platform.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mobile-menu-item',
  templateUrl: './mobile-menu-item.component.html',
  styleUrls: ['./mobile-menu-item.component.scss'],
})
export class MobileMenuItemComponent implements OnInit {

  @Input() menuItem: any = {};

  constructor(
    public devicePlatformService: DevicePlatformService,
    public router: Router
    ) { }

  ngOnInit(): void {}
}
