import { Component, OnInit } from '@angular/core';
import {DevicePlatformService} from '../shared/services/device-platform.service';
import {LanguageService} from '../shared/services/language.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  constructor(
    public devicePlatformService: DevicePlatformService,
    public languageService: LanguageService,
  ) { }

  ngOnInit(): void {
  }

}
