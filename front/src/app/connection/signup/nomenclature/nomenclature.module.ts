import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NomenclatureComponent} from './nomenclature.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [NomenclatureComponent],
  imports: [CommonModule, IonicModule],
  exports: [NomenclatureComponent]
})
export class NomenclatureModule { }
