import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications : { id : string, type : string, object: { username: string }[], date : Date, seen : boolean }[] | [] = [];

  constructor() {}

  public getNotifications() : { id : string, type : string, object: { username: string }[], date : Date, seen : boolean }[] | [] {
    return this.notifications;
  }

  public setNotifications(notifications : { id : string, type : string, object: { username: string }[], date : Date, seen : boolean }[]) : void {
    this.notifications = notifications;
    console.log(this.notifications);
    return;
  }
}
