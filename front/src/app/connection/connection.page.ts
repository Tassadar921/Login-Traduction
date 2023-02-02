import { Component, OnInit } from '@angular/core';
import {Platform} from '@ionic/angular';
import {LanguageService} from '../shared/services/language.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {

  public hasAnAccount: boolean = true;
  public currentPlatform: string | undefined;
  constructor(
    private platform: Platform,
    private languageService: LanguageService
  ) { }

  async ngOnInit() {
    this.updateCurrentPlatform();
    await this.languageService.init();
  }

  updateCurrentPlatform() {
    if(this.platform.platforms().includes('mobile')){
      this.currentPlatform = 'mobile';
    }else{
      this.currentPlatform = 'desktop';
    }
  }
}
