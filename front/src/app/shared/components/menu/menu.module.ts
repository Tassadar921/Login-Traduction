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
import {LanguageModule} from "../language/language.module";
import {IonFabLanguageModule} from "../ion-fab-language/ion-fab-language.module";
import {ProfilePopoverComponent} from './default-menu/profile-popover/profile-popover.component';
import {NotificationsModule} from '../notifications/notifications.module';


@NgModule({
    declarations: [MenuComponent, MobileMenuComponent, DefaultMenuComponent, DefaultMenuItemComponent, MobileMenuItemComponent, ProfilePopoverComponent],
  imports: [CommonModule, IonicModule, ModalCloseButtonModule, MatSidenavModule, RouterLink, LanguageModule, IonFabLanguageModule, NotificationsModule],
  exports: [MenuComponent]
})
export class MenuModule { }
