import { Component, OnInit } from '@angular/core';
import {TranslationService} from '../../services/translation.service';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

  public urlBack = environment.urlBack;

  constructor(
    public translate: TranslationService,
    public modalController: ModalController,
  ) { }

  async ngOnInit() {
    await this.translate.triggerOnLoad();
  }
}
