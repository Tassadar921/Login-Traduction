import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LanguageComponent} from '../../../../../../../Login-Traduction/back/language/language.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [LanguageComponent],
  imports: [CommonModule, IonicModule],
  exports: [LanguageComponent],
})
export class LanguageModule { }
