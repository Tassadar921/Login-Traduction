import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../../shared/services/login.service';
import {TranslationService} from '../../../shared/services/translation.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-nomenclature',
  templateUrl: './nomenclature.component.html',
  styleUrls: ['./nomenclature.component.scss', '../../../shared.scss'],
})
export class NomenclatureComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    public translate: TranslationService,
    public modalController: ModalController
  ) { }

  ngOnInit() {}

}
