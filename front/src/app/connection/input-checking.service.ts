import {Injectable} from '@angular/core';
import {LanguageService} from '../shared/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class InputCheckingService {
  public numbers = '0123456789';
  public letters = 'azertyuiopmlkjhgfdsqwxcvbnâûîôäüïëéèêùàç';
  public specialChars = '-_.!$£€@&\\{}[]()/*+';

  constructor(
    private languageService: LanguageService
  ) {}

  //checks conditions of username inputs, returning id of error messages in dictionary
  //triggers on keyup
  public checkUsername(username: string): string {
    if (username.length < 3) {
      return this.languageService.dictionary.data.services.inputChecking.usernameTooShort;
    } else if (username.length > 20) {
      return this.languageService.dictionary.data.services.inputChecking.usernameTooLong;
    } else {
      for (const char of username) {
        if (!this.numbers.includes(char)
          && !this.letters.includes(char)
          && !this.specialChars.includes(char)){
          return this.languageService.dictionary.data.services.inputChecking.usernameContainsInvalidCharacter;
        }
      }
      return '';
    }
  };

    //hardly checks all password conditions
    //triggered by checkPassword
    checkPassword (password: string): string {
      if (password.length < 7) {
        return this.languageService.dictionary.data.services.inputChecking.passwordTooShort;
      } else if (password.length > 30) {
        return this.languageService.dictionary.data.services.inputChecking.passwordTooLong;
      } else if (!this.containsUpperCase(password)) {
        return this.languageService.dictionary.data.services.inputChecking.passwordMissesUpperCase;
      } else if (!this.containsLowerCase(password)) {
        return this.languageService.dictionary.data.services.inputChecking.passwordMissesLowerCase;
      } else {
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
          return this.languageService.dictionary.data.services.inputChecking.passwordMissesNumber;
        } else if (!containsSpecialChar) {
          return this.languageService.dictionary.data.services.inputChecking.passwordMissesSpecialChar;
        } else {
          for (const char of password) {
            if (!this.numbers.includes(char)
              && !this.letters.includes(char)
              && !this.letters.toUpperCase().includes(char)
              && !this.specialChars.includes(char)) {
              return this.languageService.dictionary.data.services.inputChecking.passwordContainsInvalidCharacter;
            }
          }
          return '';
        }
      }
    };

    //checks if passwords are matching
    //triggers on keyup, before checkPassword and only in SignUpComponent
    checkPasswords = (password: string, confPassword: string) => {
      if (password !== confPassword) {
          return this.languageService.dictionary.data.services.inputChecking.passwordsDontMatch;
      } else {
        return '';
      }
    };

    //checks conditions of email inputs, returning id of error messages in dictionary
    //triggers on keyup
    checkEmail = (email: string) => {
      if (email.length < 7) {
        return this.languageService.dictionary.data.services.inputChecking.emailTooShort;
      } else if (email.length > 100) {
        return this.languageService.dictionary.data.services.inputChecking.emailTooLong;
      } else if (!this.containsAt(email)) {
        return this.languageService.dictionary.data.services.inputChecking.emailMissesAt;
      } else {
        return '';
      }
    };

    //triggers only for password inputs
    containsUpperCase = (password: string) => {
      for (const char of password) {
        if (char !== char.toLowerCase()) {
          return true;
        }
      }
      return false;
    };

    //triggers only for password inputs
    containsLowerCase = (password: string) => {
      for (const char of password) {
        if (char !== char.toUpperCase()) {
          return true;
        }
      }
      return false;
    };

    //triggers only for email inputs
    containsAt = (email: string) => {
      for (const char of email) {
        if (char === '@') {
          return true;
        }
      }
      return false;
    };
  }
