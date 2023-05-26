import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {CookieService} from './cookie.service';
import {DevicePlatformService} from './device-platform.service';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private commonTotalPages: number = 0;
  private commonCurrentPage: number = 1;
  private friendsTotalPages: number = 0;
  private friendsCurrentPage: number = 1;
  public commonFilter: string = '';
  public friendsFilter: string = '';
  public waiting: boolean = false;
  private other: Array<any> = [];
  private friends: Array<any> = [];
  private blocked: Array<any> = [];
  public currentComponent: string = '';

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private devicePlatformService: DevicePlatformService
  ) { }

  async onChangeAndInit(requestHeader: string): Promise<void> {
    // @ts-ignore
    const totalItemsNumber: Object = await this[`get${requestHeader}UsersNumber`]();
    if(Object(totalItemsNumber).status){
      if(Object(totalItemsNumber).data) {
        if(requestHeader === 'Friends') {
          this.friendsTotalPages = Math.ceil(Object(totalItemsNumber).data / this.devicePlatformService.itemsPerPage);
        }else{
          this.commonTotalPages = Math.ceil(Object(totalItemsNumber).data / this.devicePlatformService.itemsPerPage);
        }
      }else{
        if(requestHeader === 'Friends') {
          this.friendsTotalPages = 1;
        }else{
          this.commonTotalPages = 1;
        }
      }
      await this.setUsers(requestHeader, this.commonCurrentPage);
    }
  }

  public async setUsers(requestHeader: string, page: number): Promise<void> {
    this.waiting = true;
    // @ts-ignore
    const rtrn: Object = await this[`get${requestHeader}Users`](page);
    if(Object(rtrn).status){
      // @ts-ignore
      this[requestHeader.toLowerCase()] = Object(rtrn).data;
    }
    if(requestHeader === 'Friends') {
      this.friendsCurrentPage = page;
    }else{
      this.commonCurrentPage = page;
    }
    this.waiting = false;
  }

  private async getOtherUsers(page: number): Promise<Object> {
    return await this.requestService.getOtherUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      this.devicePlatformService.itemsPerPage,
      page,
      this.commonFilter
    );
  }

  private async getOtherUsersNumber(): Promise<Object> {
    return await this.requestService.getOthersUsersNumber(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
  }

  private async getBlockedUsers(page: number): Promise<Object> {
    return await this.requestService.getBlockedUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      this.devicePlatformService.itemsPerPage,
      page,
      this.commonFilter
    );
  }

  private async getBlockedUsersNumber(): Promise<Object> {
    return await this.requestService.getBlockedUsersNumber(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
  }

  private async getFriendsUsers(page: number): Promise<Object> {
    return await this.requestService.getFriendUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      this.devicePlatformService.itemsPerPage,
      page,
      this.friendsFilter
    );
  }

  private async getFriendsUsersNumber(): Promise<Object> {
    return await this.requestService.getFriendUsersNumber(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
  }

  public updateFriendStatus(friend: string, connected: boolean): void {
    this.friends.forEach((item: any): void => {
      if(item.username === friend) {
        item.online = connected;
      }
    });
  }

  public getCommonTotalPages(): number {
    return this.commonTotalPages;
  }

  public getCommonCurrentPage(): number {
    return this.commonCurrentPage;
  }

  public getFriendsTotalPages(): number {
    return this.friendsTotalPages;
  }

  public getFriendsCurrentPage(): number {
    return this.friendsCurrentPage;
  }

  public getOther(): Array<any> {
    return this.other;
  }

  public getBlocked(): Array<any> {
    return this.blocked;
  }

  public getFriends(): Array<any> {
    return this.friends;
  }
}
