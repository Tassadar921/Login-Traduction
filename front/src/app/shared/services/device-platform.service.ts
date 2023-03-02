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
    if(window.innerWidth <= 600){
      this.currentPlatform = 'small';
    }else if(window.innerWidth > 600 && window.innerWidth < 960){
      this.currentPlatform = 'medium';
    }else{
      this.currentPlatform = 'large';
    }
    console.log(this.currentPlatform)
  }

  public getDeviceContentClass() {
    return this.currentPlatform+'DeviceContent';
  }

  public getDeviceSegmentId() {
    return this.currentPlatform+'DeviceSegment';
  }
}
