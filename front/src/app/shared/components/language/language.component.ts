import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../../../../../../Login-Traduction/front/src/app/shared/services/translation.service';
import {CookiesService} from '../../../../../../../Login-Traduction/front/src/app/shared/services/cookies.service';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../../../../../Login-Traduction/front/src/environments/environment';

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
