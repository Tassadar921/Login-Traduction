import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DevicePlatformService {

  public currentPlatform: string
  constructor(
    private platform: Platform
  ) {
    if(this.platform.platforms().includes('mobile')){
      this.currentPlatform = 'mobile';
    }else{
      this.currentPlatform = 'desktop';
    }
  }
}
