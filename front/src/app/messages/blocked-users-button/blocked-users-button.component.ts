import {Component, Input, OnInit} from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {LanguageService} from '../../shared/services/language.service';
import {PagesService} from '../../shared/services/pages.service';

@Component({
  selector: 'app-blocked-users-button',
  templateUrl: './blocked-users-button.component.html',
  styleUrls: ['./blocked-users-button.component.scss'],
})
export class BlockedUsersButtonComponent implements OnInit {

  constructor(
    public languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private pagesService: PagesService
  ) { }

  ngOnInit(): void {}

  @Input() modalClosed(): void{};

}
