import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import {MenuModule} from '../shared/components/menu/menu.module';
import {SideBarComponent} from "./side-bar/side-bar.component";
import {AddComponent} from "./add/add.component";
import {BlockedComponent} from "./blocked/blocked.component";
import {ModalCloseButtonModule} from "../shared/components/modal-close-button/modal-close-button.module";
import {LanguageModule} from "../shared/components/language/language.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule,
    MenuModule,
    ModalCloseButtonModule,
    LanguageModule
  ],
  declarations: [FriendsPage, SideBarComponent, AddComponent, BlockedComponent]
})
export class FriendsPageModule {}
