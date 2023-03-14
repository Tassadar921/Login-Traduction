import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import {MenuModule} from '../shared/components/menu/menu.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FriendsPageRoutingModule,
        MenuModule
    ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
