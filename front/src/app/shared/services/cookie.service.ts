import { Injectable } from '@angular/core';
import {Preferences}  from '@capacitor/preferences';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  //for html dynamic display
  private username: string = '';

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ){}

  //returns cookie data from cookie key
  getCookie = async (key: string): Promise<any> => Object(await Preferences.get({key})).value;

  //sets cookie from key and value, erasing previous cookie if exists
  setCookie = async (key: string, value: any): Promise<void> => await Preferences.set({key, value});

  //connects user by setting cookies session token and username
  public async signIn(username: string, sessionToken: string): Promise<void> {
    await this.setCookie('username', username);
    await this.setCookie('sessionToken', sessionToken);
    this.username = username;
  }

  //disconnects user by removing cookies session token and username
  public async signOut(popover: boolean = false): Promise<void>  {
    this.username = '';
    await Preferences.remove({ key: 'username' });
    await Preferences.remove({ key: 'sessionToken' });
    if(popover) {
      await this.popoverController.dismiss();
    }
    await this.router.navigateByUrl('/connection');
  };

  //dynamic username getter
  getUsername = () => this.username;
}
