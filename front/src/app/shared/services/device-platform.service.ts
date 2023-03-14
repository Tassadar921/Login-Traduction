import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicePlatformService {

  public currentPlatform: string = 'desktop';
  constructor() {
    this.calculatePlatform();
  }

  public calculatePlatform() {
    if(window.innerWidth <= 700){
      this.currentPlatform = 'small';
    }else if(window.innerWidth > 700 && window.innerWidth < 960){
      this.currentPlatform = 'medium';
    }else{
      this.currentPlatform = 'large';
    }
  }

  public getDeviceTheme(){
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      return 'dark';
    }else{
      return 'light';
    }
  }

  public getDeviceContentClass() {
    return this.currentPlatform+'DeviceContent';
  }

  public getDeviceSegmentId() {
    return this.currentPlatform+'DeviceSegment';
  }
}
