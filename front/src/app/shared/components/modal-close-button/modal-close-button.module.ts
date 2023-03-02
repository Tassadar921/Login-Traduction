import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalCloseButtonComponent } from './modal-close-button.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [ModalCloseButtonComponent],
  imports: [CommonModule, IonicModule],
  exports: [ModalCloseButtonComponent]
})
export class ModalCloseButtonModule { }
