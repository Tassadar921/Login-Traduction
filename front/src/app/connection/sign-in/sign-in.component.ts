import {Component, OnInit} from '@angular/core';
import {DevicePlatformService} from '../../shared/services/device-platform.service';
import {RequestService} from '../../shared/services/request.service';
import {CryptoService} from '../../shared/services/crypto.service';
import {LanguageService} from '../../shared/services/language.service';
import {ToastService} from '../../shared/services/toast.service';
import {CookieService} from '../../shared/services/cookie.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../connection.page.scss'],
})

export class SignInComponent implements OnInit {

  public showPassword = false;
  public output = '';
  public identifier = '';
  public password = '';
  public waiting = false;

  constructor(
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService,
    private cryptoService: CryptoService,
    public languageService: LanguageService,
    private toastService: ToastService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {}

  public async signIn() {
    this.waiting = true;
    const rtrn = await this.requestService.signIn(
      this.identifier,
      this.cryptoService.sha256(this.password)
    );
    if(Object(rtrn).status === 0){
      this.output = this.languageService.dictionary.data.components.signIn.wrongIdentifierOrPassword;
    }else{
      await this.cookieService.connect(Object(rtrn).username, Object(rtrn).token);
      await this.toastService.displayToast(
        this.languageService.dictionary.data.components.signIn.connected, 'top'
      );
      await this.router.navigateByUrl('/home');
    }
    this.waiting = false;
  }
}
