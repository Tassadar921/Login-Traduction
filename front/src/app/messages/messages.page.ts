import { Component, OnInit } from '@angular/core';
import { DevicePlatformService } from '../shared/services/device-platform.service';
import { LanguageService } from '../shared/services/language.service';
import { PagesService } from '../shared/services/pages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  constructor(
    public devicePlatformService: DevicePlatformService,
    public languageService: LanguageService,
    public pagesService: PagesService
  ) {}

  async ngOnInit(): Promise<void> {}
}
