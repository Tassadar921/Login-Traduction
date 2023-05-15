import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevicePlatformService {

  public currentPlatform: string = 'desktop';
  public itemsPerPage: number = 10;
  constructor() {
    this.calculatePlatform();
  }

  //updates currentPlatform in function of the window size
  public calculatePlatform(): void {
    if(window.innerWidth <= 900){
      this.currentPlatform = 'small';
      this.itemsPerPage = 10;
    }else{
      this.currentPlatform = 'large';
      this.itemsPerPage = 15;
    }
  }

  //returns the current platform theme
  public getDeviceTheme(): 'dark' | 'light' {
    if(window.matchMedia("(prefers-color-scheme: dark)").matches){
      return 'dark';
    }else{
      return 'light';
    }
  }

  //returns the current platform content class
  public getDeviceContentClass(): string {
    return this.currentPlatform+'DeviceContent';
  }

  //returns the current platform segment id
  public getDeviceSegmentId(): string {
    return this.currentPlatform+'DeviceSegment';
  }
}
