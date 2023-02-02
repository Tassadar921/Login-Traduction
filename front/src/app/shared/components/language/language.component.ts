import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {environment} from '../../../../environments/environment';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

  public apiURL: string | undefined;
  constructor(
    public languageService: LanguageService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.apiURL = environment.apiUrl;
  }

}
