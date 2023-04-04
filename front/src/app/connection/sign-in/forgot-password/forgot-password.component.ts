import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LanguageService} from '../../../shared/services/language.service';
import {RequestService} from '../../../shared/services/request.service';
import {FormValidatorsService} from '../../../shared/services/form-validators.service';
import {environment} from '../../../../environments/environment';
import {ToastService} from '../../../shared/services/toast.service';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../connection.page.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  public waiting: boolean = false;
  public formControl: FormGroup;
  public output: string = '';
  public mailError: boolean = false;
  public supportEmail: string = environment.supportEmail;

  constructor(
    public languageService: LanguageService,
    public requestService: RequestService,
    private formValidatorsService: FormValidatorsService,
    private toastService: ToastService,
    private clipboard: Clipboard,
  ) {
    this.formControl = this.formValidatorsService.getForgotPasswordValidator();
  }

  ngOnInit() {
    document.addEventListener('keydown', async (event) => {
      if(event.key === 'Enter' && this.formControl.valid){
        await this.resetPassword();
      }
    });
  }

  public async resetPassword() {
    this.waiting = true;
    this.output = '';
    const rtrn = await this.requestService.resetPassword(this.formControl.value.email);
    if(Object(rtrn).status===1){
      this.output = this.languageService.dictionary.data?.components.forgotPassword.emailSent;
    }else if(Object(rtrn).status===0){
      this.output = this.languageService.dictionary.data?.components.forgotPassword.emailNotFound;
    }else if(Object(rtrn).status===-1){
      this.output = this.languageService.dictionary.data?.components.forgotPassword.mailSendingError;
    }else if(Object(rtrn).status===-2){
      this.output = this.languageService.dictionary.data?.components.forgotPassword.emailWrongFormat;
    }
    this.waiting = false;
  }

  public async copyEmail(): Promise<void> {
    this.clipboard.copy(this.supportEmail);
    await this.toastService.displayToast(this.languageService.dictionary.data.components.signUp.emailCopied, 'top');
  }
}
