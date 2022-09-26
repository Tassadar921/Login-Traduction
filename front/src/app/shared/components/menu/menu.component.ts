import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {CookiesService} from '../../services/cookies.service';
import {TranslationService} from '../../services/translation.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', '../../../shared.scss'],
})
export class MenuComponent implements OnInit {

  public hour;
  public username = '';

  constructor(
    public cookies: CookiesService,
    private router: Router,
    public translate: TranslationService,
  ) {}

  async ngOnInit() {
    this.username = await this.cookies.getFromCookies('username');
    if(!this.username){
      await this.redirect('connection');
    }
    setInterval(this.refreshTime, 1000);
  }

  refreshTime=() =>{
    if (moment().format('h:mm:ss a').includes('pm')) {
      let cut;
      for (let i = 0; i < moment().format('h:mm:ss a').length; i++) {
        if (moment().format('h:mm:ss a')[i] === ':') {
          cut = i;
          i = moment().format('h:mm:ss a').length;
        }
      }
      this.hour = (Number(moment().format('h:mm:ss a').slice(0, cut)) + 12)
        .toString() + moment().format('h:mm:ss a')
        .slice(cut, moment().format('h:mm:ss a').length - 6);
      if(this.hour[0]==='2' && this.hour[1]==='4'){
        this.hour = '12' + this.hour.slice(2,this.hour.length);
      }
    } else {
      this.hour = moment().format('h:mm:ss a')
        .slice(0, moment().format('h:mm:ss a').length - 6);
      if(this.hour[0]==='1' && this.hour[1]==='2'){
        this.hour = '00' + this.hour.slice(2,this.hour.length);
      }
    }
  };

  redirect = async (direction) =>{
    await this.router.navigateByUrl('/' + direction);
  };
}
