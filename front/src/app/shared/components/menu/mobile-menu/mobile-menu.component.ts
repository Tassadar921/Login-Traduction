import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DevicePlatformService} from '../../../services/device-platform.service';
import {CookieService} from '../../../services/cookie.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {

  public sidenavIsOpen = false;
  @ViewChild('menu') sidenav!: MatSidenav;
  @Input() menuItems: any[] = [];

  constructor(
    public devicePlatformService: DevicePlatformService,
    public cookieService: CookieService
  ) {}

  ngOnInit() {}

  public async toggleSidenav() {
    this.sidenavIsOpen = !this.sidenavIsOpen;
    await this.sidenav.toggle();
  }

  @Input() public async signOut() {
    console.log('là')
  }
}
