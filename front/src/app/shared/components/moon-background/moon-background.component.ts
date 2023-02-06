import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-moon-background',
  templateUrl: './moon-background.component.html',
  styleUrls: ['./moon-background.component.scss'],
})
export class MoonBackgroundComponent implements OnInit {

  public apiURL = environment.apiUrl;
  public windowWidth = window.innerWidth + 1000;
  public windowHeight = window.innerHeight;
  constructor() {}

  ngOnInit() {
    console.log('windowWidth', this.windowWidth)
  }

}
