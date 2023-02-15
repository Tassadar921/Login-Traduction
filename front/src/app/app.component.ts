import {Component, OnInit} from '@angular/core';
import {LanguageService} from './shared/services/language.service';
import {DevicePlatformService} from './shared/services/device-platform.service';
import {RequestService} from "./shared/services/request.service";
import {environment} from "../environments/environment";
import * as Forge from 'node-forge';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService
  ) {}

  async ngOnInit() {
    await this.languageService.init();
    environment.publicKey = Object(await this.requestService.getPublicKey()).publicKey;
    console.log(typeof environment.publicKey);

  }

  public encryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(environment.publicKey);
    return window.btoa(rsa.encrypt('Hello World!'));
  }
}
