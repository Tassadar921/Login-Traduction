import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications : [{id : string, title : string, text : string, date : Date, seen : boolean}] | unknown[] = [];

  constructor() {}

  public getNotifications() : [{ id: string; title: string; text: string; date: Date; seen: boolean }] | unknown[] {
    return this.notifications;
  }

  public setNotifications(notifications : [{ id : string, title : string, text : string, date : Date, seen : boolean }]) : void {
    this.notifications = notifications;
    return;
  }
}
