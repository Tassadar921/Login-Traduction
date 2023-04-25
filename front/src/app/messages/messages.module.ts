import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import {MenuModule} from '../shared/components/menu/menu.module';
import {ModalCloseButtonModule} from '../shared/components/modal-close-button/modal-close-button.module';
import {SideBarComponent} from './side-bar/side-bar.component';
import {BlockedComponent} from './blocked/blocked.component';
import {AddComponent} from './add/add.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MessagesPageRoutingModule,
        MenuModule,
        ModalCloseButtonModule
    ],
  declarations: [MessagesPage, SideBarComponent, BlockedComponent, AddComponent]
})
export class MessagesPageModule {}
