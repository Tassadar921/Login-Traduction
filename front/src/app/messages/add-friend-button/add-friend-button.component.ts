import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../shared/services/language.service';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {PagesService} from '../../shared/services/pages.service';

@Component({
  selector: 'app-add-friend-button',
  templateUrl: './add-friend-button.component.html',
  styleUrls: ['./add-friend-button.component.scss'],
})
export class AddFriendButtonComponent implements OnInit {

  constructor(
    public languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private pagesService: PagesService
  ) { }

  ngOnInit(): void {}

  @Input() modalClosed(): void{}

}
