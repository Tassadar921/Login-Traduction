import { Injectable } from '@angular/core';
import {TranslationService} from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //dictionnary variables
  public numbers = '0123456789';
  public letters = 'azertyuiopmlkjhgfdsqwxcvbnâûîôäüïëéèêùàç';
  public specialChars = '-_.!$£€@&\\{}[]()/*+';

  public password = '';
  public outputPassword = '';

  public confPassword = '';
  public outputConfPassword = '';

  public arePasswordsOK = true;

  public showPassword = false;
  public showConfPassword = false;

  constructor(
    private translate: TranslationService,
  ) {}

  //checks conditions of username inputs, returning id of error messages in dictionnary
  //triggers on keyup
  checkUsername = (username) => {
    if(username.length<3){
      return 0;
    }else if(username.length>20){
      return 1;
    }else if(
      !this.numbers.includes(username[username.length-1].toLowerCase())
      && !this.letters.includes(username[username.length-1].toLowerCase())
      && !this.specialChars.includes(username[username.length-1].toLowerCase())){
      return 6;
    }else{
      return 10;
    }
  };

  //hardly checks all password conditions
  //triggered by checkPassword
  checkPasswordIntermediary = (password) => {
    if(password.length<7){
      return 0;
    }else if(password.length>30) {
      return 1;
    }else if(!this.containsUpperCase(password)){
      return 2;
    }else if(!this.containsLowerCase(password)){
      return 3;
    }else {
      let containsNumbers = false;
      let containsSpecialChar = false;
      for (const char of password) {
        if (this.numbers.includes(char)) {
          containsNumbers = true;
        } else if (this.specialChars.includes(char)) {
          containsSpecialChar = true;
        }
      }
      if (!containsNumbers) {
        return 4;
      }else if (!containsSpecialChar) {
        return 5;
      }else if (
        !this.numbers.includes(password[password.length - 1].toLowerCase())
        && !this.letters.includes(password[password.length - 1].toLowerCase())
        && !this.specialChars.includes(password[password.length - 1].toLowerCase())) {
        return 6;
      } else {
        return 10;
      }
    }
  };

  //checks conditions of password inputs, returning id of error messages in dictionnary
  //triggers on keyup
  checkPassword = (password, conf=false) => {
    if(!conf){
      this.outputPassword = Object(this.translate.dictionnary)
        .connection[this.checkPasswordIntermediary(password)]
        .data;
    }else{
      this.outputConfPassword = Object(this.translate.dictionnary)
        .connection[this.checkPasswordIntermediary(password)]
        .data;
    }
    this.checkPasswords();
  };

  //checks if passwords are matching
  //triggers on keyup
  checkPasswords = () => {
    this.arePasswordsOK = this.password === this.confPassword;
    if(!this.arePasswordsOK){
      if(!this.outputPassword && !this.outputConfPassword){
        this.outputPassword = Object(this.translate.dictionnary).connection[8].data;
        this.outputConfPassword = Object(this.translate.dictionnary).connection[8].data;
      }
    }else{
      this.outputPassword = '';
      this.outputConfPassword = '';
    }
  };

  //checks conditions of email inputs, returning id of error messages in dictionnary
  //triggers on keyup
  checkEmail = (email) => {
    if(email.length<7){
      return 0;
    }else if(email.length>100){
      return 1;
    }else if(!this.containsAt(email)){
      return 7;
    }else{
      return 10;
    }
  };

  //triggers only for password inputs
  containsUpperCase = (password) => {
    for(const char of password){
      if(char!==char.toLowerCase()){
        return true;
      }
    }
    return false;
  };

  //triggers only for password inputs
  containsLowerCase = (password) => {
    for(const char of password){
      if(char!==char.toUpperCase()){
        return true;
      }
    }
    return false;
  };

  //triggers only for email inputs
  containsAt = (email) => {
    for(const char of email){
      if(char==='@'){
        return true;
      }
    }
    return false;
  };

  //triggers on keyup in email input of signUp
  updateEmail = (email) => Object(this.translate.dictionnary)
      .connection[this.checkEmail(email)]
      .data;

  //triggers on keyup in username input of signUp
  updateUsername = (username) => Object(this.translate.dictionnary)
      .connection[this.checkUsername(username)]
      .data;

  //toggles either password and text types for password inputs, allowing user to see what he's writing
  toggleShowPassword = () => this.showPassword = !this.showPassword;
  toggleShowConfPassword = () => this.showConfPassword = !this.showConfPassword;
}
