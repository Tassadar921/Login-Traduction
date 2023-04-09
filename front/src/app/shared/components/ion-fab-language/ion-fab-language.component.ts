import { Component, OnInit, Input } from '@angular/core';
import {DevicePlatformService} from "../../services/device-platform.service";

@Component({
  selector: 'app-ion-fab-language',
  templateUrl: './ion-fab-language.component.html',
  styleUrls: ['./ion-fab-language.component.scss'],
})
export class IonFabLanguageComponent implements OnInit {

  @Input() vertical: string = '';
  @Input() horizontal: string = '';
  @Input() size: string = 'large';

  constructor(
    public devicePlatformService: DevicePlatformService,
  ) { }

  ngOnInit() {}

}
