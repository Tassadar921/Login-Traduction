import {Component, OnInit} from '@angular/core';
import {LanguageService} from './shared/services/language.service';
import {DevicePlatformService} from './shared/services/device-platform.service';
import {RequestService} from "./shared/services/request.service";
import {RSAService} from "./shared/services/rsa.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService,
    private rsaService: RSAService
  ) {}

  async ngOnInit() {
    await this.languageService.init();
    await this.rsaService.setPublicKey();
  }
}
