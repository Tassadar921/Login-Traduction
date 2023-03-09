import { Injectable } from '@angular/core';
import {Preferences}  from '@capacitor/preferences';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  //for html dynamic display
  private username = '';

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ){}

  //returns cookie data from cookie key
  getCookie = async (key: string) => Object(await Preferences.get({key})).value;

  //sets cookie from key and value, erasing previous cookie if exists
  setCookie = async (key: string, value: any) => await Preferences.set({key, value});

  public async connect(username: string, token: string) {
    console.log(username, token);
    await this.setCookie('username', username);
    await this.setCookie('token', token);
    this.username = username;
  }

  disconnect = async (popover: boolean = false) => {
    this.username = '';
    await Preferences.remove({ key: 'username' });
    await Preferences.remove({ key: 'token' });
    if(popover) {
      await this.popoverController.dismiss();
    }
    await this.router.navigateByUrl('/connection');
  };

  getUsername = () => this.username;
}
