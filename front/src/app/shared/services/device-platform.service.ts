import { Injectable } from '@angular/core';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DevicePlatformService {

  public currentPlatform: string = 'desktop';
  constructor(
    private platform: Platform
  ) {
    this.calculatePlatform();
  }

  public calculatePlatform() {
    if(this.platform.platforms().includes('mobile') || window.innerWidth < 900){
      this.currentPlatform = 'mobile';
    }else{
      this.currentPlatform = 'desktop';
    }
  }
}
