import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {RequestService} from '../../shared/services/request.service';
import {CryptoService} from '../../shared/services/crypto.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../connection.page.scss'],
})

export class SignInComponent implements OnInit {

  public showPassword = false;
  public output = '';
  public username = '';
  public password = '';

  public isOpen = 'test';

  constructor(
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {}

  toggle () {
    this.isOpen === 'open' ? this.isOpen = 'closed' : this.isOpen = 'open';
  }

  public async signIn() {
    const rtrn = await this.requestService.signIn(
      this.username,
      this.cryptoService.sha256(this.password)
    );
    console.log(rtrn);
  }
}
