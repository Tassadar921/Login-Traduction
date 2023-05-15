import { Injectable } from '@angular/core';
import {RequestService} from './request.service';
import {CookieService} from './cookie.service';
import {DevicePlatformService} from './device-platform.service';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private totalPages: number = 0;
  public filter: string = '';
  private currentPage: number = 1;
  public waiting: boolean = false;
  private users: Array<any> = [];

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService,
    private devicePlatformService: DevicePlatformService
  ) { }

  async onChangeAndInit(requestHeader: string): Promise<void> {
    // @ts-ignore
    const totalItemsNumber: Object = await this[`get${requestHeader}UsersNumber`]();
    console.log(totalItemsNumber);
    if(Object(totalItemsNumber).status){
      if(Object(totalItemsNumber).data) {
        this.totalPages = Math.ceil(Object(totalItemsNumber).data / this.devicePlatformService.itemsPerPage);
      }else{
        this.totalPages = 1;
      }
      await this.setUsers(requestHeader, this.currentPage);
    }
  }

  public async setUsers(requestHeader: string, page: number): Promise<void> {
    console.log('là');
    this.waiting = true;
    // @ts-ignore
    const rtrn: Object = await this[`get${requestHeader}Users`](page);
    console.log(rtrn);
    if(Object(rtrn).status){
      this.users = Object(rtrn).data;
    }
    this.currentPage = page;
    this.waiting = false;
  }

  private async getOthersUsers(page: number): Promise<Object> {
    return await this.requestService.getOtherUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      this.devicePlatformService.itemsPerPage,
      page
    );
  }

  private async getOthersUsersNumber(): Promise<Object> {
    return await this.requestService.getOthersUsersNumber(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
  }

  private async getBlockedUsers(page: number): Promise<Object> {
    console.log('ici');
    return await this.requestService.getBlockedUsers(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken'),
      this.devicePlatformService.itemsPerPage,
      page
    );
  }

  private async getBlockedUsersNumber(): Promise<Object> {
    return await this.requestService.getBlockedUsersNumber(
      await this.cookieService.getCookie('username'),
      await this.cookieService.getCookie('sessionToken')
    );
  }

  public getTotalPages(): number {
    return this.totalPages;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public getUsers(): Array<any> {
    return this.users;
  }
}
