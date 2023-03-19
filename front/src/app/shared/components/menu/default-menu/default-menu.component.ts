import {AfterViewInit, Component, Input} from '@angular/core';
import {CookieService} from "../../../services/cookie.service";
import {DevicePlatformService} from "../../../services/device-platform.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-default-menu',
  templateUrl: './default-menu.component.html',
  styleUrls: ['./default-menu.component.scss'],
})
export class DefaultMenuComponent implements AfterViewInit {

  @Input() menuItems: any[] = [];
  @Input() public async signOut() {}

  constructor(
    public cookieService: CookieService,
    public devicePlatformService: DevicePlatformService,
    public router: Router
  ) {}

  ngAfterViewInit() {
    for(const menuItem of this.menuItems) {
      let menuItemElement = document.getElementById('menuItem'+this.menuItems.indexOf(menuItem));
      menuItemElement!.addEventListener('pointerenter', () => {
        let left = 0;
        for(let i = 0; i<this.menuItems.indexOf(menuItem); i++) {
            left+=document.getElementById('menuItem'+i)!.offsetWidth;
        }
        left+= menuItemElement!.offsetWidth/2
          - document.getElementById('indicator')!.offsetWidth/2;
        document.getElementById('indicator')!.style.left =
          left+'px';
        document.getElementById('indicator')!.style.background =
          'linear-gradient(130deg, '+this.randomColor()+', '+this.randomColor()+')';
        });
    }
  }

  //function that returns a random color
  public randomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  }
}
