import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonFabLanguageComponent} from "./ion-fab-language.component";
import {IonicModule} from '@ionic/angular';
import {ModalCloseButtonModule} from '../modal-close-button/modal-close-button.module';
import {LanguageModule} from "../language/language.module";


@NgModule({
  declarations: [IonFabLanguageComponent],
  imports: [CommonModule, IonicModule, ModalCloseButtonModule, LanguageModule],
  exports: [IonFabLanguageComponent]
})
export class IonFabLanguageModule { }
