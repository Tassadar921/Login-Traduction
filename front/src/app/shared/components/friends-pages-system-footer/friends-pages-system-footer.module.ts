import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsPagesSystemFooterComponent } from './friends-pages-system-footer.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [FriendsPagesSystemFooterComponent],
  imports: [CommonModule, IonicModule],
  exports: [FriendsPagesSystemFooterComponent]
})
export class FriendsPagesSystemFooterModule { }
