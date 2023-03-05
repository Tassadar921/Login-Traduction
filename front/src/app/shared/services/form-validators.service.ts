import { Injectable } from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public getSignUpValidator(){
    return this.formBuilder.group({
      username: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ0-9_-]{3,20}$'),
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        }
      ), email: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.email
          ]
        }
      ), password: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]
        }
      ), confirmPassword: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]
        }
      )
    }, {
      validators: this.matchValidator('password', 'confirmPassword')
    } as AbstractControlOptions);
  }

  public getResetPasswordValidator(){
    return this.formBuilder.group({
      password: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]
        }
      ), confirmPassword: this.formBuilder.control(
        '',
        {
          updateOn: 'change',
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*#?&\\.\\-_])[A-Za-z\\d@$!%*?&\\.\\-_]{8,}$'),
            Validators.minLength(8)
          ]
        }
      )
    }, {
      validators: this.matchValidator('password', 'confirmPassword')
    } as AbstractControlOptions);
  }

  private matchValidator(controlOne: string, controlTwo: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[controlOne];
      const control2 = formGroup.controls[controlTwo];
      if (control1.errors && !control2.errors?.['match']) {
        return;
      }
      if (control1.value !== control2.value) {
        control2.setErrors({ match: true });

      } else {
        control2.setErrors(null);
      }
    }
  }
}
