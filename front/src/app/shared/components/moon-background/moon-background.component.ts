import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-moon-background',
  templateUrl: './moon-background.component.html',
  styleUrls: ['./moon-background.component.scss'],
})
export class MoonBackgroundComponent implements OnInit {

  public apiURL = environment.apiUrl;
  constructor() {}

  ngOnInit() {}

}
