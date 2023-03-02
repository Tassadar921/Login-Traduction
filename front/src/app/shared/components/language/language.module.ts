import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageComponent} from './language.component';
import {IonicModule} from '@ionic/angular';
import {ModalCloseButtonModule} from '../modal-close-button/modal-close-button.module';


@NgModule({
  declarations: [LanguageComponent],
    imports: [CommonModule, IonicModule, ModalCloseButtonModule],
  exports: [LanguageComponent]
})
export class LanguageModule { }
