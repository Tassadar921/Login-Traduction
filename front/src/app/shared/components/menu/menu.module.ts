import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from './menu.component';
import {IonicModule} from '@ionic/angular';
import {LanguageModule} from '../language/language.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    LanguageModule,
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
