import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MenuComponent} from "./menu.component";
import {IonicModule} from '@ionic/angular';
import {ModalCloseButtonModule} from '../modal-close-button/modal-close-button.module';
import {MatSidenavModule} from "@angular/material/sidenav";


@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, IonicModule, ModalCloseButtonModule, MatSidenavModule],
  exports: [MenuComponent]
})
export class MenuModule { }
