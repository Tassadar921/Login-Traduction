import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import {MenuModule} from '../shared/components/menu/menu.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MessagesPageRoutingModule,
        MenuModule
    ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
