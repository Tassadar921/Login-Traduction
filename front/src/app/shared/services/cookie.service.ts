
import { Injectable } from '@angular/core';
import {Preferences}  from '@capacitor/preferences';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  //for html dynamic display
  public username = '';

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ){}

  //returns cookie data from cookie key
  getFromCookies = async (key: string) => Object(await Preferences.get({key})).data;

  //sets cookie from key and value, erasing previous cookie if exists
  setCookie = async (key: string, value: any) => await Preferences.set({key, value});

  //disconnection is in a popover
  disconnect = async () => {
    this.username = '';
    await Preferences.remove({ key: 'username' });
    await Preferences.remove({ key: 'token' });
    await this.popoverController.dismiss();
    await this.router.navigateByUrl('/connection');
  };
}
