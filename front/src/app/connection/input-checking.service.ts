import {Injectable} from '@angular/core';
import {LanguageService} from '../shared/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class InputCheckingService {
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
    private languageService: LanguageService
  ) {
  }

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
          && !this.specialChars.includes(char)) {
          return this.languageService.dictionary.data.services.inputChecking.usernameContainsInvalidCharacters;
        }
      }
      return '';
    }
  };

    //hardly checks all password conditions
    //triggered by checkPassword
    checkPasswordIntermediary (password: string): string {
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
          return this.languageService.dictionary.data.services.inputChecking.passwordMissesNumbers;
        } else if (!containsSpecialChar) {
          return this.languageService.dictionary.data.services.inputChecking.passwordMissesSpecialChar;
        } else {
          for (const char of password) {
            if (!this.numbers.includes(char)
              && !this.letters.includes(char)
              && !this.specialChars.includes(char)) {
              return this.languageService.dictionary.data.services.inputChecking.passwordContainsInvalidCharacters;
            }
          }
          return '';
        }
      }
    };

    //checks conditions of password inputs, returning id of error messages in dictionary
    //triggers on keyup
    checkPassword = (password: string, signUp: boolean) => {
      if (!signUp) {
        this.outputPassword = Object(this.languageService.dictionary)
          .connection[this.checkPasswordIntermediary(password)]
          .data;
      } else {
        this.outputConfPassword = Object(this.languageService.dictionary)
          .connection[this.checkPasswordIntermediary(password)]
          .data;
      }
      this.checkPasswords();
    };

    //checks if passwords are matching
    //triggers on keyup
    checkPasswords = () => {
      this.arePasswordsOK = this.password === this.confPassword;
      if (!this.arePasswordsOK) {
        if (!this.outputPassword && !this.outputConfPassword) {
          this.outputPassword = Object(this.languageService.dictionary).connection[8].data;
          this.outputConfPassword = Object(this.languageService.dictionary).connection[8].data;
        }
      } else {
        this.outputPassword = '';
        this.outputConfPassword = '';
      }
    };

    //checks conditions of email inputs, returning id of error messages in dictionary
    //triggers on keyup
    checkEmail = (email: string) => {
      if (email.length < 7) {
        return 0;
      } else if (email.length > 100) {
        return 1;
      } else if (!this.containsAt(email)) {
        return 7;
      } else {
        return 10;
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

    //triggers on keyup in email input of signUp
    updateEmail = (email: string) => Object(this.languageService.dictionary)
      .connection[this.checkEmail(email)]
      .data;

    //triggers on keyup in username input of signUp
    updateUsername = (username: string) => Object(this.languageService.dictionary)
      .connection[this.checkUsername(username)]
      .data;
  }
