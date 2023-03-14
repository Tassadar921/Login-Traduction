import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MenuComponent} from "./menu.component";
import {IonicModule} from '@ionic/angular';
import {ModalCloseButtonModule} from '../modal-close-button/modal-close-button.module';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MobileMenuComponent} from "./mobile-menu/mobile-menu.component";
import {DefaultMenuComponent} from "./default-menu/default-menu.component";
import {DefaultMenuItemComponent} from "./default-menu/default-menu-item/default-menu-item.component";
import {MobileMenuItemComponent} from './mobile-menu/mobile-menu-item/mobile-menu-item.component';
import {RouterLink} from '@angular/router';


@NgModule({
    declarations: [MenuComponent, MobileMenuComponent, DefaultMenuComponent, DefaultMenuItemComponent, MobileMenuItemComponent],
  imports: [CommonModule, IonicModule, ModalCloseButtonModule, MatSidenavModule, RouterLink],
  exports: [MenuComponent]
})
export class MenuModule { }
