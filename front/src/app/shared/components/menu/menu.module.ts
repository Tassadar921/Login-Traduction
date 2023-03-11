import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MenuComponent} from "./menu.component";
import {IonicModule} from '@ionic/angular';
import {ModalCloseButtonModule} from '../modal-close-button/modal-close-button.module';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MobileMenuComponent} from "./mobile-menu/mobile-menu.component";
import {DefaultMenuComponent} from "./default-menu/default-menu.component";


@NgModule({
  declarations: [MenuComponent, MobileMenuComponent, DefaultMenuComponent],
    imports: [CommonModule, IonicModule, ModalCloseButtonModule, MatSidenavModule],
  exports: [MenuComponent]
})
export class MenuModule { }