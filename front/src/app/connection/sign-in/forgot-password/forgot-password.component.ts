import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LanguageService} from '../../../shared/services/language.service';
import {RequestService} from '../../../shared/services/request.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../connection.page.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  public waiting: boolean = false;
  public formControl: any;
  public output: string = '';

  constructor(
    public languageService: LanguageService,
    public requestService: RequestService
  ) {
    this.formControl = new FormGroup({
          email: new FormControl(
            '',
            {
              updateOn: 'change',
              validators: [
                Validators.required,
                Validators.email
              ]
            }
          )
    });
  }

  ngOnInit() {}

  public async mailResetPassword() {
    this.waiting = true;
    const rtrn = await this.requestService.mailResetPassword(this.formControl.controls.email.value);
    console.log(rtrn);
    this.waiting = false;
  }

}
