import { Component, OnInit } from '@angular/core';
import {CookieService} from '../../shared/services/cookie.service';
import {RequestService} from '../../shared/services/request.service';
import {ActionSheetController} from '@ionic/angular';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {PagesService} from '../../shared/services/pages.service';
import {SocketService} from '../../shared/services/socket.service';
import {LanguageService} from '../../shared/services/language.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private actionSheetController: ActionSheetController,
    public devicePlatformService: DevicePlatformService,
    public pagesService: PagesService,
    private socketService: SocketService,
    public languageService: LanguageService
  ) {}

  async ngOnInit(): Promise<void> {
    window.addEventListener(('resize'), async (): Promise<void> => {
      await this.pagesService.onChangeAndInit('Other');
    });
    await this.pagesService.onChangeAndInit('Other');
  }

  public async addFriend(username: string, ask: boolean): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.askIfNotAddFriend(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      username
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      if(ask){
        await this.socketService.addNotificationAskFriend(username);
      }
      await this.pagesService.onChangeAndInit('Other');
    }
  }

  public async refuseFriendRequest(senderUsername: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.refuseFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      senderUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Other');
    }
  }

  public async cancelFriendRequest(receiverUsername: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.cancelFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      receiverUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Other');
    }
  }

  public async actionSheetRemoveFriend(receiverUsername: string): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: this.languageService.dictionary.data?.components.add.removeFriend?.replace('<USERNAME>', receiverUsername),
      buttons: [
        {
          text: this.languageService.dictionary.data?.components.add.confirm,
          icon: 'checkmark',
          handler: async(): Promise<void> => {
            await this.removeFriend(receiverUsername)
          },
        },
        {
          text: this.languageService.dictionary.data?.components.add.cancel,
          icon: 'close',
        }
      ],
    });
    await actionSheet.present();
  }

  public async actionSheetBlockUser(receiverUsername: string): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: this.languageService.dictionary.data?.components.add.blockUser?.replace('<USERNAME>', receiverUsername),
      buttons: [
        {
          text: this.languageService.dictionary.data?.components.add.confirm,
          icon: 'close',
          handler: async(): Promise<void> => {
            await this.blockUser(receiverUsername)
          },
        },
        {
          text: this.languageService.dictionary.data?.components.add.cancel,
          icon: 'close',
        }
      ],
    });
    await actionSheet.present();
  }

  public async removeFriend(receiverUsername: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.removeFriend(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      receiverUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Other');
    }
  }

  public async blockUser(blockedUsername: string): Promise<void> {
    this.pagesService.waiting = true;
    const rtrn: Object = await this.requestService.blockUser(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      blockedUsername
    );
    this.pagesService.waiting = false;
    if(Object(rtrn).status){
      await this.pagesService.onChangeAndInit('Other');
    }
  }
}
