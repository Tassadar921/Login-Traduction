import { Component, OnInit } from '@angular/core';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {

  public hasAnAccount: boolean = true;
  public currentPlatform: string | undefined;
  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    this.updateCurrentPlatform();
  }

  updateCurrentPlatform() {
    if(this.platform.platforms().includes('mobile')){
      this.currentPlatform = 'mobile';
    }else{
      this.currentPlatform = 'desktop';
    }
  }
}
