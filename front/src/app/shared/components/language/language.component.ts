import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {environment} from '../../../../environments/environment';
import {DevicePlatformService} from '../../services/device-platform.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

  public apiURL: string;
  constructor(
    public languageService: LanguageService,
    public devicePlatformService: DevicePlatformService
  ) {
    this.apiURL = environment.apiUrl;
  }

  ngOnInit(): void {}

}
