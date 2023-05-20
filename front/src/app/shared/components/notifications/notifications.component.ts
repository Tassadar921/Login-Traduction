import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { FriendRequestService } from '../../services/friend-request.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(
    public friendRequestService: FriendRequestService,
    public languageService: LanguageService,
    public notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {}

  public getAddFriendText(username: string): string {
    return this.languageService.dictionary.data?.components.notifications.addFriend.replace('<USERNAME>', username);
  }
}
