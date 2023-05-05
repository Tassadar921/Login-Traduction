import { Component, OnInit } from '@angular/core';
import {CookieService} from '../../shared/services/cookie.service';
import {RequestService} from '../../shared/services/request.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  public currentPage: number = 1;
  public users: Array<any> = [];
  public waiting: boolean = false;

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.setUsers(1);
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
    console.log(this.users);
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
    console.log(rtrn);
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
    console.log(rtrn);
    if(Object(rtrn).status){
      await this.setUsers(this.currentPage);
    }
  }
}
