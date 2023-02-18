import {Component, OnInit} from '@angular/core';
import {LanguageService} from './shared/services/language.service';
import {DevicePlatformService} from './shared/services/device-platform.service';
import {CryptoService} from "./shared/services/crypto.service";
import {RequestService} from "./shared/services/request.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private cryptoService: CryptoService,
    private requestService: RequestService
  ) {}

  async ngOnInit() {
    await this.languageService.init();
    await this.cryptoService.setRsaPublicKey();
  }
}
