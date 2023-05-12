import { Component, OnInit } from '@angular/core';
import {CookieService} from '../../shared/services/cookie.service';
import {RequestService} from '../../shared/services/request.service';
import {ActionSheetController} from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  public currentPage: number = 1;
  public users: Array<any> = [];
  public waiting: boolean = false;
  public usersNumber: number = 0;

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private actionSheetController: ActionSheetController,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.setUsers(1);
    const rtrn: Object = await this.requestService.getNumberOfOtherUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
    if(Object(rtrn).status){
      this.usersNumber = Object(rtrn).data;
    }
    console.log(this.usersNumber);
  }

  public async setUsers(page: number): Promise<void> {
    this.waiting = true;
    this.currentPage = page;
    const rtrn: Object = await this.requestService.getOtherUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      10,
      page
    );
    if(Object(rtrn).status){
      this.users = Object(rtrn).data;
    }
    this.waiting = false;
  }

  public async addFriend(username: string): Promise<void> {
    this.waiting = true;
    const rtrn: Object = await this.requestService.askIfNotAddFriend(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      username
    );
    this.waiting = false;
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }

  public async refuseFriendRequest(senderUsername: string): Promise<void> {
    this.waiting = true;
    const rtrn: Object = await this.requestService.refuseFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      senderUsername
    );
    this.waiting = false;
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }

  public async cancelFriendRequest(receiverUsername: string): Promise<void> {
    this.waiting = true;
    const rtrn: Object = await this.requestService.cancelFriendRequest(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      receiverUsername
    );
    this.waiting = false;
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }

  public async actionSheetRemoveFriend(receiverUsername: string): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: `Remove ${receiverUsername} from friends ?`,
      buttons: [
        {
          text: 'Accept',
          icon: 'checkmark',
          handler: async(): Promise<void> => {
            await this.removeFriend(receiverUsername)
          },
        },
        {
          text: 'Decline',
          icon: 'close',
        }
      ],
    });
    await actionSheet.present();
  }

  public async actionSheetBlockUser(receiverUsername: string): Promise<void> {
    const actionSheet: HTMLIonActionSheetElement = await this.actionSheetController.create({
      header: `Block ${receiverUsername} ?`,
      buttons: [
        {
          text: 'Block',
          icon: 'close',
          handler: async(): Promise<void> => {
            await this.blockUser(receiverUsername)
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
        }
      ],
    });
    await actionSheet.present();
  }

  public async removeFriend(receiverUsername: string): Promise<void> {
    this.waiting = true;
    const rtrn: Object = await this.requestService.removeFriend(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      receiverUsername
    );
    this.waiting = false;
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }

  public async blockUser(blockedUsername: string): Promise<void> {
    this.waiting = true;
    const rtrn: Object = await this.requestService.blockUser(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      blockedUsername
    );
    console.log(rtrn);
    this.waiting = false;
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }
}
