import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../shared/services/request.service';
import {CookieService} from '../../shared/services/cookie.service';
import {ActionSheetController} from '@ionic/angular';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {PagesService} from '../../shared/services/pages.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.scss'],
})
export class BlockedComponent implements OnInit {

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private actionSheetController: ActionSheetController,
    public devicePlatformService: DevicePlatformService,
    public pagesService: PagesService
  ) {}

  async ngOnInit(): Promise<void> {
    window.addEventListener(('resize'), async (): Promise<void> => {
      await this.pagesService.onChangeAndInit('Blocked');
    });
    await this.pagesService.onChangeAndInit('Blocked');
  }

  public async actionSheetUnblockUser(receiverUsername: string): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: `Unblock ${receiverUsername} ?`,
      buttons: [
        {
          text: 'Yes',
          icon: 'checkmark',
          handler: async(): Promise<void> => {
            await this.unblockUser(receiverUsername)
          },
        },
        {
          text: 'No',
          icon: 'close',
        }
      ],
    });
    await actionSheet.present();
  }

  async unblockUser(blockedUser: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.unblockUser(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      blockedUser
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Blocked');
    }
  }

}
