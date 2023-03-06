import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReturnToButtonComponent} from './return-to-button.component';
import {ModalCloseButtonModule} from "../modal-close-button/modal-close-button.module";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [ReturnToButtonComponent],
  imports: [CommonModule, ModalCloseButtonModule, IonicModule],
  exports: [ReturnToButtonComponent]
})
export class ReturnToButtonModule { }
