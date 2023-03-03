import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NomenclatureComponent} from "./nomenclature.component";
import {ModalCloseButtonModule} from "../modal-close-button/modal-close-button.module";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [NomenclatureComponent],
  imports: [CommonModule, ModalCloseButtonModule, IonicModule],
  exports: [NomenclatureComponent]
})
export class NomenclatureModule { }
