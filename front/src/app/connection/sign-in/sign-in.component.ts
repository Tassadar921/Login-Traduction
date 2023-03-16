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

  public showPassword:boolean = false;
  public output:string = '';
  public identifier:string = '';
  public password:string = '';
  public waiting:boolean = false;

  constructor(
    public devicePlatformService: DevicePlatformService,
    private requestService: RequestService,
    private cryptoService: CryptoService,
    public languageService: LanguageService,
    private toastService: ToastService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    document.addEventListener('keydown', async (event) => {
      if(event.key === 'Enter' && this.identifier && this.password){
        await this.signIn();
      }
    });
  }

  public async signIn(): Promise<void> {
    // this.waiting = true;
    this.output = '';
    const rtrn = await this.requestService.signIn(
      this.identifier,
      this.cryptoService.sha256(this.password)
    );
    if(Object(rtrn).status === 0){
      this.output = this.languageService.dictionary.data.components.signIn.wrongIdentifierOrPassword;
    }else{
      console.log(rtrn);
      await this.cookieService.signIn(Object(rtrn).username, Object(rtrn).sessionToken);
      await this.toastService.displayToast(
        this.languageService.dictionary.data.components.signIn.connected, 'top'
      );
      await this.router.navigateByUrl('/home');
    }
    this.waiting = false;
    return;
  }

  public async keyDown(event: KeyboardEvent): Promise<void> {

  }
}
