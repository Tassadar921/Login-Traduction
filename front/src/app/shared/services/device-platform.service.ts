import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicePlatformService {

  public currentPlatform: string = 'desktop';
  constructor() {
    this.calculatePlatform();
  }

  //updates currentPlatform in function of the window size
  public calculatePlatform() {
    if(window.innerWidth <= 700){
      this.currentPlatform = 'small';
    }else if(window.innerWidth > 700 && window.innerWidth < 960){
      this.currentPlatform = 'medium';
    }else{
      this.currentPlatform = 'large';
    }
  }

  //returns the current platform theme
  public getDeviceTheme(){
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      return 'dark';
    }else{
      return 'light';
    }
  }

  //returns the current platform content class
  public getDeviceContentClass() {
    return this.currentPlatform+'DeviceContent';
  }

  //returns the current platform segment id
  public getDeviceSegmentId() {
    return this.currentPlatform+'DeviceSegment';
  }
}
