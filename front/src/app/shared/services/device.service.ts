import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private platform: Platform
  ) {}

  //returns approximatly screen size
  getDevice= () => {
    if(this.platform.is('mobile') || this.platform.is('mobileweb')){
      return 'small';
    }else{
      return 'large';
    }
  };
}
