import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {CookiesService} from '../../services/cookies.service';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss', '../../../shared.scss'],
})
export class LanguageComponent implements OnInit {

  public urlBack = environment.urlBack;

  constructor(
    public translate: TranslationService,
    public cookies: CookiesService,
    public modalController: ModalController,
  ) { }

  async ngOnInit() {
    await this.translate.triggerOnLoad();
  }

}
